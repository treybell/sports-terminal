from typing import Optional

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


class PlayerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    first_name: str
    last_name: str
    is_active: bool
