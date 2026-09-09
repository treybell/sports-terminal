from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Player
from app.schemas import PlayerOut

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
