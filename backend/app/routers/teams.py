from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Player, Team
from app.schemas import TeamDetailOut, TeamOut

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[TeamOut])
def list_teams(
    search: str = Query(default="", description="Name substring to search for"),
    db: Session = Depends(get_db),
):
    stmt = select(Team).order_by(Team.full_name).limit(50)
    if search:
        stmt = stmt.where(Team.full_name.ilike(f"%{search}%"))
    return db.scalars(stmt).all()


@router.get("/{team_id}", response_model=TeamDetailOut)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    roster = db.scalars(
        select(Player)
        .where(Player.team_id == team_id)
        .order_by(Player.full_name)
    ).all()

    return TeamDetailOut(**TeamOut.model_validate(team).model_dump(), roster=roster)
