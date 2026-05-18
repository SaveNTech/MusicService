from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Album(Base):
    __tablename__ = "albums"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id", ondelete="CASCADE"))
    year: Mapped[int] = mapped_column(Integer)
    cover_path: Mapped[str | None] = mapped_column(String(512))
    color: Mapped[str] = mapped_column(String(7), default="#3b82f6")
    type: Mapped[str] = mapped_column(String(16), default="album")  # album | ep | single
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    artist: Mapped["Artist"] = relationship(back_populates="albums")
    tracks: Mapped[list["Track"]] = relationship(back_populates="album", cascade="all, delete-orphan")
