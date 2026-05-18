from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.playlist import Playlist, PlaylistTrack
from app.models.album import Album
from app.schemas.playlist import PlaylistOut, PlaylistBrief
from app.routers.tracks import _track_to_out

router = APIRouter(prefix="/playlists", tags=["playlists"])


def _playlist_cover(pl: Playlist) -> str | None:
    return f"/media/covers/{Path(pl.cover_path).name}" if pl.cover_path else None


@router.get("", response_model=list[PlaylistBrief])
async def list_playlists(request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(
        select(Playlist).options(selectinload(Playlist.track_entries))
    )
    return [
        PlaylistBrief(
            id=pl.id, title=pl.title, description=pl.description,
            color=pl.color, cover_url=_playlist_cover(pl),
            track_count=len(pl.track_entries),
        )
        for pl in result.scalars().all()
    ]


@router.get("/{playlist_id}", response_model=PlaylistOut)
async def get_playlist(playlist_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    from app.models.track import Track

    result = await db.execute(
        select(Playlist).where(Playlist.id == playlist_id)
        .options(
            selectinload(Playlist.track_entries).selectinload(PlaylistTrack.track).selectinload(Track.artist),
            selectinload(Playlist.track_entries).selectinload(PlaylistTrack.track).selectinload(Track.album).selectinload(Album.artist),
        )
    )
    pl = result.scalar_one_or_none()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")

    tracks_out = [_track_to_out(entry.track, request) for entry in pl.track_entries]

    return PlaylistOut(
        id=pl.id, title=pl.title, description=pl.description,
        color=pl.color, cover_url=_playlist_cover(pl), tracks=tracks_out,
    )
