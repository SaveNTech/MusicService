from pydantic import BaseModel
from app.schemas.artist import ArtistOut
from app.schemas.album import AlbumOut


class TrackOut(BaseModel):
    id: int
    title: str
    album_id: int
    artist_id: int
    album: AlbumOut
    artist: ArtistOut
    duration: int
    plays: int
    audio_url: str
    cover_url: str | None = None

    model_config = {"from_attributes": True}


class TrackBrief(BaseModel):
    """Compact track without nested album/artist objects."""
    id: int
    title: str
    album_id: int
    artist_id: int
    duration: int
    plays: int
    audio_url: str
    cover_url: str | None = None

    model_config = {"from_attributes": True}
