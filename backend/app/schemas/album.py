from pydantic import BaseModel
from app.schemas.artist import ArtistOut


class AlbumOut(BaseModel):
    id: int
    title: str
    artist_id: int
    artist: ArtistOut
    year: int
    color: str
    type: str
    cover_url: str | None = None

    model_config = {"from_attributes": True}


class AlbumCreate(BaseModel):
    title: str
    artist_id: int
    year: int
    color: str = "#3b82f6"
    type: str = "album"
