from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    abbreviation: Mapped[str] = mapped_column(String, nullable=False)
    nickname: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String, nullable=False)
    year_founded: Mapped[int] = mapped_column(nullable=True)
    wins: Mapped[int] = mapped_column(nullable=True)
    losses: Mapped[int] = mapped_column(nullable=True)

    players: Mapped[list["Player"]] = relationship(back_populates="team")


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)

    team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id"), nullable=True
    )
    position: Mapped[str] = mapped_column(String, nullable=True)
    team: Mapped[Team] = relationship(back_populates="players")

    points_per_game: Mapped[float] = mapped_column(Float, nullable=True)
    rebounds_per_game: Mapped[float] = mapped_column(Float, nullable=True)
    assists_per_game: Mapped[float] = mapped_column(Float, nullable=True)
    stats_synced_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
