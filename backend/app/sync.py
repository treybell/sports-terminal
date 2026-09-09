from nba_api.stats.static import players as nba_players
from nba_api.stats.static import teams as nba_teams
from sqlalchemy.dialects.postgresql import insert

from app.database import SessionLocal
from app.models import Player, Team


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


if __name__ == "__main__":
    db = SessionLocal()
    try:
        team_count = sync_teams(db)
        player_count = sync_players(db)
        print(f"Synced {team_count} teams and {player_count} players.")
    finally:
        db.close()
