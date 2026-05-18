from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Artist(Base):
    __tablename__ = "artists"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    bio: Mapped[str | None] = mapped_column(Text)
    cover_path: Mapped[str | None] = mapped_column(String(512))
    color: Mapped[str] = mapped_column(String(7), default="#3b82f6")
    monthly_listeners: Mapped[int] = mapped_column(Integer, default=0)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    albums: Mapped[list["Album"]] = relationship(back_populates="artist", cascade="all, delete-orphan")
    tracks: Mapped[list["Track"]] = relationship(back_populates="artist")
