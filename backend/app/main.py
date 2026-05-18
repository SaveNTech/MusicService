from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.models import *  # noqa: F401,F403 — register all models with Base
from app.routers import auth, tracks, artists, albums, playlists, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup (use alembic for production migrations)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Ensure media directories exist
    Path(settings.AUDIO_DIR).mkdir(parents=True, exist_ok=True)
    Path(settings.COVERS_DIR).mkdir(parents=True, exist_ok=True)

    yield


app = FastAPI(
    title="AURA Music API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

# API routes
app.include_router(auth.router, prefix="/api")
app.include_router(tracks.router, prefix="/api")
app.include_router(artists.router, prefix="/api")
app.include_router(albums.router, prefix="/api")
app.include_router(playlists.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "aura-music"}
