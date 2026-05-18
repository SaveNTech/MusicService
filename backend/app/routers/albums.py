from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.album import Album
from app.models.track import Track
from app.schemas.album import AlbumOut
from app.schemas.track import TrackOut
from app.routers.artists import _artist_out
from app.routers.tracks import _track_to_out

router = APIRouter(prefix="/albums", tags=["albums"])


def _album_out(album: Album) -> AlbumOut:
    cover_url = f"/media/covers/{Path(album.cover_path).name}" if album.cover_path else None
    return AlbumOut(
        id=album.id, title=album.title, artist_id=album.artist_id,
        artist=_artist_out(album.artist),
        year=album.year, color=album.color, type=album.type, cover_url=cover_url,
    )


@router.get("", response_model=list[AlbumOut])
async def list_albums(request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(
        select(Album).options(selectinload(Album.artist)).order_by(Album.created_at.desc())
    )
    return [_album_out(al) for al in result.scalars().all()]


@router.get("/{album_id}", response_model=AlbumOut)
async def get_album(album_id: int, request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(
        select(Album).where(Album.id == album_id).options(selectinload(Album.artist))
    )
    album = result.scalar_one_or_none()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return _album_out(album)


@router.get("/{album_id}/tracks", response_model=list[TrackOut])
async def album_tracks(album_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Track).where(Track.album_id == album_id)
        .options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Album.artist),
        )
        .order_by(Track.id)
    )
    return [_track_to_out(t, request) for t in result.scalars().all()]
