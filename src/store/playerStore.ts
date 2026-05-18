import { create } from 'zustand'
import type { Track } from '@/types'
import { tracksApi } from '@/api'

const audioEl = typeof window !== 'undefined' ? new Audio() : null

function loadFavorites(): number[] {
  try {
    return JSON.parse(localStorage.getItem('aura_favorites') ?? '[]')
  } catch {
    return []
  }
}

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  progress: number
  isShuffle: boolean
  repeatMode: 'off' | 'all' | 'one'
  favorites: number[]
}

interface PlayerActions {
  playTrack: (track: Track, queue?: Track[]) => void
  togglePlay: () => void
  setVolume: (v: number) => void
  setProgress: (p: number) => void
  nextTrack: () => void
  prevTrack: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  toggleFavorite: (trackId: number) => void
  isFavorite: (trackId: number) => boolean
  syncFavorites: (ids: number[]) => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => {
  if (audioEl) {
    audioEl.volume = 0.8

    audioEl.addEventListener('timeupdate', () => {
      const dur = audioEl.duration
      if (dur && !isNaN(dur) && dur > 0) {
        set({ progress: audioEl.currentTime / dur })
      }
    })

    audioEl.addEventListener('loadedmetadata', () => {
      const { currentTrack } = get()
      if (currentTrack && audioEl.duration && !isNaN(audioEl.duration)) {
        set({ currentTrack: { ...currentTrack, duration: Math.floor(audioEl.duration) } })
      }
    })

    audioEl.addEventListener('ended', () => {
      const { repeatMode } = get()
      if (repeatMode === 'one') {
        audioEl.currentTime = 0
        audioEl.play().catch(() => {})
      } else {
        get().nextTrack()
      }
    })
  }

  return {
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    isShuffle: false,
    repeatMode: 'off',
    favorites: loadFavorites(),

    playTrack: (track, queue) => {
      const { currentTrack, isPlaying } = get()

      if (currentTrack?.id === track.id) {
        if (audioEl) {
          if (isPlaying) { audioEl.pause(); set({ isPlaying: false }) }
          else { audioEl.play().catch(() => {}); set({ isPlaying: true }) }
        }
        return
      }

      if (audioEl) {
        audioEl.src = track.audio_url
        audioEl.currentTime = 0
        audioEl.play().catch(() => {})
      }

      set({ currentTrack: track, queue: queue ?? [track], isPlaying: true, progress: 0 })
    },

    togglePlay: () => {
      const { isPlaying, currentTrack } = get()
      if (!currentTrack) return
      if (audioEl) {
        if (isPlaying) audioEl.pause()
        else audioEl.play().catch(() => {})
      }
      set({ isPlaying: !isPlaying })
    },

    setVolume: (v) => {
      const vol = Math.max(0, Math.min(1, v))
      if (audioEl) audioEl.volume = vol
      set({ volume: vol })
    },

    setProgress: (p) => {
      const clamped = Math.max(0, Math.min(1, p))
      if (audioEl && audioEl.duration && !isNaN(audioEl.duration)) {
        audioEl.currentTime = clamped * audioEl.duration
      }
      set({ progress: clamped })
    },

    nextTrack: () => {
      const { queue, currentTrack, isShuffle } = get()
      if (!currentTrack || queue.length === 0) return
      const idx = queue.findIndex(t => t.id === currentTrack.id)
      const next = isShuffle
        ? queue[Math.floor(Math.random() * queue.length)]
        : queue[(idx + 1) % queue.length]
      if (next) get().playTrack(next, queue)
    },

    prevTrack: () => {
      const { queue, currentTrack, progress } = get()
      if (!currentTrack || queue.length === 0) return
      if (progress > 0.05) { get().setProgress(0); return }
      const idx = queue.findIndex(t => t.id === currentTrack.id)
      const prev = queue[(idx - 1 + queue.length) % queue.length]
      if (prev) get().playTrack(prev, queue)
    },

    toggleShuffle: () => set(s => ({ isShuffle: !s.isShuffle })),

    cycleRepeat: () =>
      set(s => ({
        repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
      })),

    toggleFavorite: async (trackId) => {
      const { favorites } = get()
      const next = favorites.includes(trackId)
        ? favorites.filter(id => id !== trackId)
        : [...favorites, trackId]
      localStorage.setItem('aura_favorites', JSON.stringify(next))
      set({ favorites: next })
      // sync with backend (fire and forget)
      tracksApi.toggleFavorite(trackId).catch(() => {})
    },

    isFavorite: (trackId) => get().favorites.includes(trackId),

    syncFavorites: (ids) => {
      localStorage.setItem('aura_favorites', JSON.stringify(ids))
      set({ favorites: ids })
    },
  }
})
