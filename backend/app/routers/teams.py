from fastapi import APIRouter
from nba_api.stats.static import teams as nba_teams

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("")
def list_teams():
    return nba_teams.get_teams()
