export interface Artist {
  id: number
  name: string
  bio: string | null
  color: string
  monthly_listeners: number
  verified: boolean
  cover_url: string | null
}

export interface Album {
  id: number
  title: string
  artist_id: number
  artist: Artist
  year: number
  color: string
  type: 'album' | 'ep' | 'single'
  cover_url: string | null
}

export interface Track {
  id: number
  title: string
  album_id: number
  artist_id: number
  album: Album
  artist: Artist
  duration: number
  plays: number
  audio_url: string
  cover_url: string | null
}

export interface Playlist {
  id: number
  title: string
  description: string | null
  color: string
  cover_url: string | null
  tracks?: Track[]
  track_count?: number
}

export interface Genre {
  id: string
  name: string
  color: string
}

export interface AuthUser {
  id: number
  email: string
  username: string
  is_admin: boolean
}
