from pathlib import Path

from fastapi import APIRouter, Depends, Form, HTTPException, Request, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.album import Album
from app.models.artist import Artist
from app.models.playlist import Playlist, PlaylistTrack
from app.models.track import Track
from app.models.user import User
from app.schemas.album import AlbumOut, AlbumCreate
from app.schemas.artist import ArtistOut, ArtistCreate
from app.schemas.playlist import PlaylistBrief, PlaylistCreate
from app.schemas.track import TrackOut
from app.services.storage import save_audio, save_cover
from app.routers.artists import _artist_out
from app.routers.albums import _album_out
from app.routers.tracks import _track_to_out

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Artists ──────────────────────────────────────────────────────────────────

@router.post("/artists", response_model=ArtistOut, status_code=201)
async def create_artist(
    request: Request,
    name: str = Form(...),
    bio: str | None = Form(None),
    color: str = Form("#3b82f6"),
    monthly_listeners: int = Form(0),
    verified: bool = Form(False),
    cover: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    cover_path = None
    if cover and cover.filename:
        cover_path = await save_cover(cover)

    artist = Artist(
        name=name, bio=bio, color=color,
        monthly_listeners=monthly_listeners, verified=verified,
        cover_path=cover_path,
    )
    db.add(artist)
    await db.commit()
    await db.refresh(artist)
    return _artist_out(artist)


@router.delete("/artists/{artist_id}", status_code=204)
async def delete_artist(
    artist_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Artist).where(Artist.id == artist_id))
    artist = result.scalar_one_or_none()
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    await db.delete(artist)
    await db.commit()


# ── Albums ───────────────────────────────────────────────────────────────────

@router.post("/albums", response_model=AlbumOut, status_code=201)
async def create_album(
    request: Request,
    title: str = Form(...),
    artist_id: int = Form(...),
    year: int = Form(...),
    color: str = Form("#3b82f6"),
    type: str = Form("album"),
    cover: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    artist_res = await db.execute(select(Artist).where(Artist.id == artist_id))
    if not artist_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Artist not found")

    cover_path = None
    if cover and cover.filename:
        cover_path = await save_cover(cover)

    album = Album(title=title, artist_id=artist_id, year=year, color=color, type=type, cover_path=cover_path)
    db.add(album)
    await db.commit()

    result = await db.execute(
        select(Album).where(Album.id == album.id).options(selectinload(Album.artist))
    )
    return _album_out(result.scalar_one())


@router.delete("/albums/{album_id}", status_code=204)
async def delete_album(
    album_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Album).where(Album.id == album_id))
    album = result.scalar_one_or_none()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    await db.delete(album)
    await db.commit()


# ── Tracks ───────────────────────────────────────────────────────────────────

@router.post("/tracks", response_model=TrackOut, status_code=201)
async def upload_track(
    request: Request,
    title: str = Form(...),
    album_id: int = Form(...),
    artist_id: int = Form(...),
    duration: int = Form(0),
    audio: UploadFile = File(...),
    cover: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    # Validate album and artist exist
    album_res = await db.execute(
        select(Album).where(Album.id == album_id).options(selectinload(Album.artist))
    )
    if not album_res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Album not found")

    audio_path = await save_audio(audio)
    cover_path = None
    if cover and cover.filename:
        cover_path = await save_cover(cover)

    track = Track(
        title=title, album_id=album_id, artist_id=artist_id,
        duration=duration, audio_path=audio_path, cover_path=cover_path,
    )
    db.add(track)
    await db.commit()

    result = await db.execute(
        select(Track).where(Track.id == track.id).options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Album.artist),
        )
    )
    return _track_to_out(result.scalar_one(), request)


@router.delete("/tracks/{track_id}", status_code=204)
async def delete_track(
    track_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Track).where(Track.id == track_id))
    track = result.scalar_one_or_none()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    await db.delete(track)
    await db.commit()


# ── Playlists ─────────────────────────────────────────────────────────────────

@router.post("/playlists", response_model=PlaylistBrief, status_code=201)
async def create_playlist(
    request: Request,
    body: PlaylistCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_admin),
):
    pl = Playlist(title=body.title, description=body.description, color=body.color, created_by=user.id)
    db.add(pl)
    await db.flush()

    for pos, track_id in enumerate(body.track_ids):
        db.add(PlaylistTrack(playlist_id=pl.id, track_id=track_id, position=pos))

    await db.commit()
    await db.refresh(pl)

    cover_url = f"/media/covers/{Path(pl.cover_path).name}" if pl.cover_path else None
    return PlaylistBrief(
        id=pl.id, title=pl.title, description=pl.description,
        color=pl.color, cover_url=cover_url, track_count=len(body.track_ids),
    )


@router.post("/playlists/{playlist_id}/tracks/{track_id}", status_code=201)
async def add_track_to_playlist(
    playlist_id: int, track_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    from sqlalchemy import func
    count = await db.scalar(
        select(func.count()).select_from(PlaylistTrack).where(PlaylistTrack.playlist_id == playlist_id)
    )
    db.add(PlaylistTrack(playlist_id=playlist_id, track_id=track_id, position=count))
    await db.commit()
    return {"ok": True}


@router.delete("/playlists/{playlist_id}/tracks/{track_id}", status_code=204)
async def remove_track_from_playlist(
    playlist_id: int, track_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(PlaylistTrack).where(
            PlaylistTrack.playlist_id == playlist_id,
            PlaylistTrack.track_id == track_id,
        )
    )
    entry = result.scalar_one_or_none()
    if entry:
        await db.delete(entry)
        await db.commit()
