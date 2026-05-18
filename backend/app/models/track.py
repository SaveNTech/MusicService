from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id", ondelete="CASCADE"))
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id", ondelete="CASCADE"))
    duration: Mapped[int] = mapped_column(Integer, default=0)
    plays: Mapped[int] = mapped_column(Integer, default=0)
    audio_path: Mapped[str] = mapped_column(String(512))
    cover_path: Mapped[str | None] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    album: Mapped["Album"] = relationship(back_populates="tracks")
    artist: Mapped["Artist"] = relationship(back_populates="tracks")
    playlist_entries: Mapped[list["PlaylistTrack"]] = relationship(back_populates="track", cascade="all, delete-orphan")
