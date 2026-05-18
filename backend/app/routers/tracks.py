import os
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.database import get_db
from app.dependencies import get_optional_user
from app.models.track import Track
from app.models.user import User, UserFavorite
from app.schemas.track import TrackOut

router = APIRouter(prefix="/tracks", tags=["tracks"])


def _track_to_out(track: Track, request: Request) -> TrackOut:  # noqa: ARG001
    audio_url = f"/api/tracks/{track.id}/stream"
    cover_url = f"/media/covers/{Path(track.cover_path).name}" if track.cover_path else None
    return TrackOut(
        id=track.id,
        title=track.title,
        album_id=track.album_id,
        artist_id=track.artist_id,
        album=track.album,
        artist=track.artist,
        duration=track.duration,
        plays=track.plays,
        audio_url=audio_url,
        cover_url=cover_url,
    )


@router.get("", response_model=list[TrackOut])
async def list_tracks(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Track).options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Track.album.property.mapper.class_.artist),
        ).order_by(Track.plays.desc())
    )
    tracks = result.scalars().all()
    return [_track_to_out(t, request) for t in tracks]


@router.get("/{track_id}", response_model=TrackOut)
async def get_track(track_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Track).where(Track.id == track_id).options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Track.album.property.mapper.class_.artist),
        )
    )
    track = result.scalar_one_or_none()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return _track_to_out(track, request)


@router.get("/{track_id}/stream")
async def stream_track(track_id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Track).where(Track.id == track_id))
    track = result.scalar_one_or_none()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    file_path = Path(settings.AUDIO_DIR) / track.audio_path
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")

    file_size = file_path.stat().st_size
    range_header = request.headers.get("range")

    # Increment play count
    track.plays += 1
    await db.commit()

    # Determine MIME type
    ext = file_path.suffix.lower()
    mime = {".mp3": "audio/mpeg", ".wav": "audio/wav", ".flac": "audio/flac",
            ".ogg": "audio/ogg", ".m4a": "audio/mp4"}.get(ext, "audio/mpeg")

    if range_header:
        start, end = 0, file_size - 1
        parts = range_header.replace("bytes=", "").split("-")
        start = int(parts[0]) if parts[0] else 0
        end = int(parts[1]) if parts[1] else file_size - 1
        length = end - start + 1

        def iter_file(s: int, l: int):
            with open(file_path, "rb") as f:
                f.seek(s)
                remaining = l
                while remaining > 0:
                    chunk = f.read(min(65536, remaining))
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    yield chunk

        return StreamingResponse(
            iter_file(start, length),
            status_code=206,
            media_type=mime,
            headers={
                "Content-Range": f"bytes {start}-{end}/{file_size}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(length),
            },
        )

    def iter_full():
        with open(file_path, "rb") as f:
            while chunk := f.read(65536):
                yield chunk

    return StreamingResponse(
        iter_full(),
        media_type=mime,
        headers={
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
        },
    )


@router.post("/{track_id}/favorite")
async def toggle_favorite(
    track_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    if not user:
        raise HTTPException(status_code=401, detail="Login required")

    result = await db.execute(
        select(UserFavorite).where(
            UserFavorite.user_id == user.id,
            UserFavorite.track_id == track_id,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        await db.delete(existing)
        await db.commit()
        return {"favorited": False}
    else:
        db.add(UserFavorite(user_id=user.id, track_id=track_id))
        await db.commit()
        return {"favorited": True}


@router.get("/me/favorites", response_model=list[TrackOut])
async def my_favorites(
    request: Request,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    if not user:
        raise HTTPException(status_code=401, detail="Login required")

    result = await db.execute(
        select(Track)
        .join(UserFavorite, UserFavorite.track_id == Track.id)
        .where(UserFavorite.user_id == user.id)
        .options(
            selectinload(Track.artist),
            selectinload(Track.album).selectinload(Track.album.property.mapper.class_.artist),
        )
    )
    return [_track_to_out(t, request) for t in result.scalars().all()]
