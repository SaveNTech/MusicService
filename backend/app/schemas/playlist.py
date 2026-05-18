from pydantic import BaseModel
from app.schemas.track import TrackOut


class PlaylistOut(BaseModel):
    id: int
    title: str
    description: str | None
    color: str
    cover_url: str | None = None
    tracks: list[TrackOut] = []

    model_config = {"from_attributes": True}


class PlaylistBrief(BaseModel):
    id: int
    title: str
    description: str | None
    color: str
    cover_url: str | None = None
    track_count: int = 0

    model_config = {"from_attributes": True}


class PlaylistCreate(BaseModel):
    title: str
    description: str | None = None
    color: str = "#3b82f6"
    track_ids: list[int] = []
