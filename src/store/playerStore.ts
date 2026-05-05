import { create } from 'zustand'
import type { Track } from '@/types'

const audioEl = typeof window !== 'undefined' ? new Audio() : null

function loadFavorites(): string[] {
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
  favorites: string[]
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
  toggleFavorite: (trackId: string) => void
  isFavorite: (trackId: string) => boolean
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
        if (audioEl && track.audioSrc) {
          if (isPlaying) { audioEl.pause(); set({ isPlaying: false }) }
          else { audioEl.play().catch(() => {}); set({ isPlaying: true }) }
        }
        return
      }

      if (audioEl && track.audioSrc) {
        audioEl.src = track.audioSrc
        audioEl.currentTime = 0
        audioEl.play().catch(() => {})
      }

      set({
        currentTrack: track,
        queue: queue ?? [track],
        isPlaying: !!track.audioSrc,
        progress: 0,
      })
    },

    togglePlay: () => {
      const { isPlaying, currentTrack } = get()
      if (!currentTrack) return
      if (audioEl && currentTrack.audioSrc) {
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
      let next: Track | undefined
      if (isShuffle) {
        const others = queue.filter(t => t.id !== currentTrack.id)
        next = others[Math.floor(Math.random() * others.length)]
      } else {
        next = queue[(idx + 1) % queue.length]
      }
      if (next) get().playTrack(next, queue)
    },

    prevTrack: () => {
      const { queue, currentTrack, progress } = get()
      if (!currentTrack || queue.length === 0) return
      if (progress > 0.05) {
        get().setProgress(0)
        return
      }
      const idx = queue.findIndex(t => t.id === currentTrack.id)
      const prev = queue[(idx - 1 + queue.length) % queue.length]
      if (prev) get().playTrack(prev, queue)
    },

    toggleShuffle: () => set(s => ({ isShuffle: !s.isShuffle })),

    cycleRepeat: () =>
      set(s => ({
        repeatMode:
          s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
      })),

    toggleFavorite: (trackId) => {
      const { favorites } = get()
      const next = favorites.includes(trackId)
        ? favorites.filter(id => id !== trackId)
        : [...favorites, trackId]
      localStorage.setItem('aura_favorites', JSON.stringify(next))
      set({ favorites: next })
    },

    isFavorite: (trackId) => get().favorites.includes(trackId),
  }
})
