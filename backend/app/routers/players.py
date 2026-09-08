from fastapi import APIRouter, Query
from nba_api.stats.static import players as nba_players

router = APIRouter(prefix="/players", tags=["players"])


@router.get("")
def search_players(search: str = Query(default="", description="Name substring to search for")):
    all_players = nba_players.get_players()

    if not search:
        return all_players[:50]

    query = search.lower()
    matches = [p for p in all_players if query in p["full_name"].lower()]
    return matches[:50]
