from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from nba_api.stats.endpoints import playercareerstats
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Player
from app.schemas import PlayerDetailOut, PlayerOut

router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=list[PlayerOut])
def search_players(
    search: str = Query(default="", description="Name substring to search for"),
    db: Session = Depends(get_db),
):
    stmt = select(Player).order_by(Player.full_name).limit(50)
    if search:
        stmt = stmt.where(Player.full_name.ilike(f"%{search}%"))
    return db.scalars(stmt).all()


@router.get("/{player_id}", response_model=PlayerDetailOut)
def get_player(player_id: int, db: Session = Depends(get_db)):
    player = db.get(Player, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    if player.stats_synced_at is None:
        _fetch_and_cache_stats(player, db)

    return player


def _fetch_and_cache_stats(player: Player, db: Session):
    """Live call to nba_api, only made once per player, then cached forever.

    nba_api's live endpoints are unofficial and can fail or time out, so a
    failure here doesn't break the request — the profile just renders
    without a stat line, and we try again on the next request since
    stats_synced_at stays unset.
    """
    try:
        data = playercareerstats.PlayerCareerStats(
            player_id=player.id, timeout=20
        ).get_normalized_dict()
        seasons = data["SeasonTotalsRegularSeason"]

        if seasons:
            latest = seasons[-1]
            games_played = latest["GP"] or 0
            if games_played > 0:
                player.points_per_game = round(latest["PTS"] / games_played, 1)
                player.rebounds_per_game = round(latest["REB"] / games_played, 1)
                player.assists_per_game = round(latest["AST"] / games_played, 1)

        player.stats_synced_at = datetime.utcnow()
        db.commit()
    except Exception:
        db.rollback()
