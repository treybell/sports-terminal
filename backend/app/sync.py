import time

from nba_api.stats.endpoints import commonteamroster, leaguestandings
from nba_api.stats.static import players as nba_players
from nba_api.stats.static import teams as nba_teams
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from app.database import SessionLocal
from app.models import Player, Team

ROSTER_REQUEST_DELAY_SECONDS = 0.6


def sync_teams(db):
    rows = nba_teams.get_teams()
    stmt = insert(Team).values(rows)
    stmt = stmt.on_conflict_do_update(
        index_elements=[Team.id],
        set_={c: stmt.excluded[c] for c in rows[0] if c != "id"},
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


def sync_players(db):
    rows = nba_players.get_players()
    stmt = insert(Player).values(rows)
    stmt = stmt.on_conflict_do_update(
        index_elements=[Player.id],
        set_={c: stmt.excluded[c] for c in rows[0] if c != "id"},
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


def sync_standings(db):
    """One live call gets wins/losses for all 30 teams at once."""
    rows = leaguestandings.LeagueStandings(timeout=30).get_normalized_dict()[
        "Standings"
    ]
    for row in rows:
        db.execute(
            update(Team)
            .where(Team.id == row["TeamID"])
            .values(wins=row["WINS"], losses=row["LOSSES"])
        )
    db.commit()
    return len(rows)


def sync_rosters(db):
    """One live call per team assigns each player to a team_id + position.

    This is 30 separate network calls (one per team), so it's deliberately
    throttled with a delay between requests — nba_api's live endpoints are
    unofficial and can rate-limit or block callers that hammer them.
    """
    team_ids = db.scalars(select(Team.id)).all()
    updated = 0

    for team_id in team_ids:
        roster = commonteamroster.CommonTeamRoster(
            team_id=team_id, timeout=30
        ).get_normalized_dict()["CommonTeamRoster"]

        for entry in roster:
            db.execute(
                update(Player)
                .where(Player.id == entry["PLAYER_ID"])
                .values(team_id=team_id, position=entry["POSITION"] or None)
            )
            updated += 1

        db.commit()
        time.sleep(ROSTER_REQUEST_DELAY_SECONDS)

    return updated


if __name__ == "__main__":
    db = SessionLocal()
    try:
        team_count = sync_teams(db)
        player_count = sync_players(db)
        print(f"Synced {team_count} teams and {player_count} players.")

        standings_count = sync_standings(db)
        print(f"Synced standings for {standings_count} teams.")

        roster_count = sync_rosters(db)
        print(f"Synced roster assignments for {roster_count} players.")
    finally:
        db.close()
