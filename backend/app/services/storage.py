import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import UploadFile

from app.config import settings

ALLOWED_AUDIO = {".mp3", ".wav", ".flac", ".ogg", ".m4a"}
ALLOWED_IMAGE = {".jpg", ".jpeg", ".png", ".webp"}


def _unique_name(original: str) -> str:
    ext = Path(original).suffix.lower()
    return f"{uuid.uuid4().hex}{ext}"


async def save_audio(file: UploadFile) -> str:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_AUDIO:
        raise ValueError(f"Unsupported audio format: {ext}")

    filename = _unique_name(file.filename or "track.mp3")
    dest = Path(settings.AUDIO_DIR) / filename

    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            await out.write(chunk)

    return filename


async def save_cover(file: UploadFile) -> str:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE:
        raise ValueError(f"Unsupported image format: {ext}")

    filename = _unique_name(file.filename or "cover.jpg")
    dest = Path(settings.COVERS_DIR) / filename

    async with aiofiles.open(dest, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            await out.write(chunk)

    return filename


def delete_file(path: str, kind: str = "audio") -> None:
    base = settings.AUDIO_DIR if kind == "audio" else settings.COVERS_DIR
    full = Path(base) / path
    if full.exists():
        full.unlink()
