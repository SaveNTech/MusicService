export interface Artist {
  id: string
  name: string
  bio: string
  gradient: [string, string]
  monthlyListeners: number
  verified: boolean
}

export interface Album {
  id: string
  title: string
  artistId: string
  year: number
  gradient: [string, string]
  type: 'album' | 'ep' | 'single'
}

export interface Track {
  id: string
  title: string
  albumId: string
  artistId: string
  duration: number
  plays: number
  audioSrc?: string
  coverSrc?: string
}

export interface Playlist {
  id: string
  title: string
  description: string
  gradient: [string, string]
  trackIds: string[]
  createdBy: string
}

export interface Genre {
  id: string
  name: string
  gradient: [string, string]
}
