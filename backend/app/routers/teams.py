from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Team
from app.schemas import TeamOut

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
