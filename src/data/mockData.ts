import type { Artist, Album, Track, Playlist, Genre } from '@/types'

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'BEARWOLF',
    bio: 'Российский хип-хоп / трэп',
    gradient: ['#7c3aed', '#06b6d4'],
    monthlyListeners: 850_000,
    verified: false,
  },
  {
    id: 'a2',
    name: 'Sayan',
    bio: 'Российский поп / хип-хоп',
    gradient: ['#ec4899', '#f97316'],
    monthlyListeners: 1_200_000,
    verified: false,
  },
]

export const albums: Album[] = [
  {
    id: 'al1',
    title: 'Феникс',
    artistId: 'a1',
    year: 2024,
    gradient: ['#7c3aed', '#06b6d4'],
    type: 'single',
  },
  {
    id: 'al2',
    title: 'Мальборро',
    artistId: 'a2',
    year: 2024,
    gradient: ['#ec4899', '#f97316'],
    type: 'single',
  },
]

export const tracks: Track[] = [
  {
    id: 't1',
    title: 'Феникс',
    albumId: 'al1',
    artistId: 'a1',
    duration: 0,
    plays: 5_100_000,
    audioSrc: '/audio/BEARWOLF - Феникс - BEARWOLF (populars-music.ru).mp3',
    coverSrc: '/covers/Феникс.jpg',
  },
  {
    id: 't2',
    title: 'Мальборро',
    albumId: 'al2',
    artistId: 'a2',
    duration: 0,
    plays: 3_200_000,
    audioSrc: '/audio/Sayan_Мальборро.mp3',
    coverSrc: '/covers/SAYAN.jpg',
  },
]

export const playlists: Playlist[] = [
  {
    id: 'p1',
    title: 'Сейчас в тренде',
    description: 'Самые горячие треки прямо сейчас',
    gradient: ['#7c3aed', '#ec4899'],
    trackIds: ['t1', 't2'],
    createdBy: 'AURA',
  },
  {
    id: 'p2',
    title: 'Русский хип-хоп',
    description: 'Лучший отечественный хип-хоп и трэп',
    gradient: ['#0ea5e9', '#6366f1'],
    trackIds: ['t1', 't2'],
    createdBy: 'AURA',
  },
  {
    id: 'p3',
    title: 'Ночная поездка',
    description: 'Для поздних прогулок и ночных мыслей',
    gradient: ['#14b8a6', '#0ea5e9'],
    trackIds: ['t2', 't1'],
    createdBy: 'AURA',
  },
  {
    id: 'p4',
    title: 'На повторе',
    description: 'Треки, от которых невозможно оторваться',
    gradient: ['#f97316', '#ec4899'],
    trackIds: ['t1', 't2'],
    createdBy: 'AURA',
  },
]

export const genres: Genre[] = [
  { id: 'g1', name: 'Хип-хоп', gradient: ['#7c3aed', '#06b6d4'] },
  { id: 'g2', name: 'R&B / Soul', gradient: ['#14b8a6', '#6366f1'] },
  { id: 'g3', name: 'Поп', gradient: ['#ec4899', '#f97316'] },
  { id: 'g4', name: 'Рок', gradient: ['#ef4444', '#f97316'] },
  { id: 'g5', name: 'Электронная', gradient: ['#3b82f6', '#8b5cf6'] },
  { id: 'g6', name: 'Трэп', gradient: ['#f59e0b', '#ef4444'] },
  { id: 'g7', name: 'Инди', gradient: ['#22c55e', '#14b8a6'] },
  { id: 'g8', name: 'Джаз', gradient: ['#6366f1', '#ec4899'] },
]

export function getArtistById(id: string) {
  return artists.find(a => a.id === id)
}
export function getAlbumById(id: string) {
  return albums.find(a => a.id === id)
}
export function getTrackById(id: string) {
  return tracks.find(t => t.id === id)
}
export function getPlaylistById(id: string) {
  return playlists.find(p => p.id === id)
}
export function getAlbumTracks(albumId: string) {
  return tracks.filter(t => t.albumId === albumId)
}
export function getArtistAlbums(artistId: string) {
  return albums.filter(a => a.artistId === artistId)
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatPlays(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}
