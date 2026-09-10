from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class TeamOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    abbreviation: str
    nickname: str
    city: str
    state: str
    year_founded: Optional[int]
    wins: Optional[int]
    losses: Optional[int]


class PlayerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    first_name: str
    last_name: str
    is_active: bool
    team_id: Optional[int]
    position: Optional[str]


class PlayerDetailOut(PlayerOut):
    team: Optional[TeamOut]
    points_per_game: Optional[float]
    rebounds_per_game: Optional[float]
    assists_per_game: Optional[float]


class TeamDetailOut(TeamOut):
    roster: List[PlayerOut]
