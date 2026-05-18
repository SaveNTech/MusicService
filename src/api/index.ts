import { api } from './client'
import type { Artist, Album, Track, Playlist } from '@/types'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (email: string, username: string, password: string) =>
    api.post<{ access_token: string }>('/auth/register', { email, username, password }),

  login: (email: string, password: string) =>
    api.post<{ access_token: string }>('/auth/login', { email, password }),

  me: () =>
    api.get<{ id: number; email: string; username: string; is_admin: boolean }>('/auth/me'),
}

// ── Tracks ────────────────────────────────────────────────────────────────────
export const tracksApi = {
  list: () => api.get<Track[]>('/tracks'),
  get: (id: number) => api.get<Track>(`/tracks/${id}`),
  favorites: () => api.get<Track[]>('/tracks/me/favorites'),
  toggleFavorite: (id: number) => api.post<{ favorited: boolean }>(`/tracks/${id}/favorite`),
  streamUrl: (id: number) => `/api/tracks/${id}/stream`,
}

// ── Artists ───────────────────────────────────────────────────────────────────
export const artistsApi = {
  list: () => api.get<Artist[]>('/artists'),
  get: (id: number) => api.get<Artist>(`/artists/${id}`),
  albums: (id: number) => api.get<Album[]>(`/artists/${id}/albums`),
  tracks: (id: number) => api.get<Track[]>(`/artists/${id}/tracks`),
}

// ── Albums ────────────────────────────────────────────────────────────────────
export const albumsApi = {
  list: () => api.get<Album[]>('/albums'),
  get: (id: number) => api.get<Album>(`/albums/${id}`),
  tracks: (id: number) => api.get<Track[]>(`/albums/${id}/tracks`),
}

// ── Playlists ─────────────────────────────────────────────────────────────────
export const playlistsApi = {
  list: () => api.get<Playlist[]>('/playlists'),
  get: (id: number) => api.get<Playlist>(`/playlists/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  createArtist: (data: FormData) => api.post<Artist>('/admin/artists', data),
  deleteArtist: (id: number) => api.delete(`/admin/artists/${id}`),

  createAlbum: (data: FormData) => api.post<Album>('/admin/albums', data),
  deleteAlbum: (id: number) => api.delete(`/admin/albums/${id}`),

  uploadTrack: (data: FormData) => api.post<Track>('/admin/tracks', data),
  deleteTrack: (id: number) => api.delete(`/admin/tracks/${id}`),

  createPlaylist: (data: { title: string; description?: string; color: string; track_ids: number[] }) =>
    api.post<Playlist>('/admin/playlists', data),
  addTrackToPlaylist: (playlistId: number, trackId: number) =>
    api.post(`/admin/playlists/${playlistId}/tracks/${trackId}`),
  removeTrackFromPlaylist: (playlistId: number, trackId: number) =>
    api.delete(`/admin/playlists/${playlistId}/tracks/${trackId}`),
}
