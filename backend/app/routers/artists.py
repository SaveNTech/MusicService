from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.artist import Artist
from app.models.album import Album
from app.models.track import Track
from app.schemas.artist import ArtistOut
from app.schemas.album import AlbumOut
from app.schemas.track import TrackOut
from app.routers.tracks import _track_to_out

router = APIRouter(prefix="/artists", tags=["artists"])


def _artist_out(artist: Artist) -> ArtistOut:
    cover_url = f"/media/covers/{Path(artist.cover_path).name}" if artist.cover_path else None
    return ArtistOut(
        id=artist.id,
        name=artist.name,
        bio=artist.bio,
        color=artist.color,
        monthly_listeners=artist.monthly_listeners,
        verified=artist.verified,
        cover_url=cover_url,
    )


# Keep old name as alias so albums.py can still import it
def _artist_url(artist: Artist, request: Request) -> ArtistOut:  # noqa: ARG001
    return _artist_out(artist)


@router.get("", response_model=list[ArtistOut])
async def list_artists(request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(select(Artist).order_by(Artist.monthly_listeners.desc()))
    return [_artist_out(a) for a in result.scalars().all()]


@router.get("/{artist_id}", response_model=ArtistOut)
async def get_artist(artist_id: int, request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(select(Artist).where(Artist.id == artist_id))
    artist = result.scalar_one_or_none()
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return _artist_out(artist)


@router.get("/{artist_id}/albums", response_model=list[AlbumOut])
async def artist_albums(artist_id: int, request: Request, db: AsyncSession = Depends(get_db)):  # noqa: ARG001
    result = await db.execute(
        select(Album).where(Album.artist_id == artist_id)
        .options(selectinload(Album.artist))
        .order_by(Album.year.desc())
    )
    albums = result.scalars().all()
    out = []
    for al in albums:
        cover_url = f"/media/covers/{Path(al.cover_path).name}" if al.cover_path else None
        out.append(AlbumOut(
            id=al.id, title=al.title, artist_id=al.artist_id,
            artist=_artist_out(al.artist),
            year=al.year, color=al.color, type=al.type, cover_url=cover_url,
        ))
    return out


@router.get("/{artist_id}/tracks", response_model=list[TrackOut])
async def artist_tracks(artist_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Track).where(Track.artist_id == artist_id)
        .options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Album.artist),
        )
        .order_by(Track.plays.desc())
    )
    return [_track_to_out(t, request) for t in result.scalars().all()]
