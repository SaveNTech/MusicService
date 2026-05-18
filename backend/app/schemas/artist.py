from pydantic import BaseModel


class ArtistOut(BaseModel):
    id: int
    name: str
    bio: str | None
    color: str
    monthly_listeners: int
    verified: bool
    cover_url: str | None = None

    model_config = {"from_attributes": True}


class ArtistCreate(BaseModel):
    name: str
    bio: str | None = None
    color: str = "#3b82f6"
    monthly_listeners: int = 0
    verified: bool = False
