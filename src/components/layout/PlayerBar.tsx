import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart,
} from 'lucide-react'
import { clsx } from 'clsx'
import { usePlayerStore } from '@/store/playerStore'
import { Cover } from '@/components/ui/Cover'
import { NowPlayingIcon } from '@/components/ui/NowPlayingIcon'
import { formatDuration } from '@/utils'

export function PlayerBar() {
  const {
    currentTrack, isPlaying, volume, progress,
    isShuffle, repeatMode,
    togglePlay, setVolume, setProgress,
    nextTrack, prevTrack, toggleShuffle, cycleRepeat,
    toggleFavorite, isFavorite,
  } = usePlayerStore()

  const liked = currentTrack ? isFavorite(currentTrack.id) : false
  const progressPercent = Math.round(progress * 100)
  const duration = currentTrack?.duration ?? 0
  const currentSeconds = Math.round(progress * duration)

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setProgress((e.clientX - rect.left) / rect.width)
  }

  return (
    <footer className="h-[80px] flex-shrink-0 bg-bg-surface border-t border-border z-20">
      <div className="flex items-center h-full px-4 gap-4">
        {/* Track info */}
        <div className="w-[240px] flex-shrink-0 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="relative w-10 h-10 flex-shrink-0">
                <Cover
                  src={currentTrack.cover_url ?? currentTrack.album.cover_url}
                  color={currentTrack.album.color}
                  className="w-10 h-10"
                  rounded="sm"
                  alt={currentTrack.title}
                />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-sm bg-black/50 flex items-center justify-center">
                    <NowPlayingIcon isPlaying size={12} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">{currentTrack.title}</p>
                <p className="text-xs text-text-secondary truncate">{currentTrack.artist.name}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={clsx(
                  'flex-shrink-0 p-1 transition-colors',
                  liked ? 'text-red-400' : 'text-text-muted hover:text-text-secondary',
                )}
              >
                <Heart className={clsx('w-4 h-4', liked && 'fill-current')} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 opacity-20">
              <div className="w-10 h-10 rounded-sm bg-bg-card" />
              <div>
                <div className="h-3 w-20 rounded bg-bg-card mb-1.5" />
                <div className="h-2.5 w-14 rounded bg-bg-card" />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5 max-w-[480px] mx-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleShuffle}
              className={clsx(
                'p-2 rounded transition-colors',
                isShuffle ? 'text-accent-light' : 'text-text-muted hover:text-text-secondary',
              )}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button onClick={prevTrack} className="p-2 rounded text-text-secondary hover:text-text-primary transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!currentTrack}
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 mx-1',
                currentTrack
                  ? 'bg-white text-black hover:scale-105 active:scale-95'
                  : 'bg-white/10 text-white/30 cursor-not-allowed',
              )}
            >
              {isPlaying
                ? <Pause className="w-4 h-4 fill-current" />
                : <Play className="w-4 h-4 fill-current ml-0.5" />
              }
            </button>

            <button onClick={nextTrack} className="p-2 rounded text-text-secondary hover:text-text-primary transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={cycleRepeat}
              className={clsx(
                'p-2 rounded transition-colors relative',
                repeatMode !== 'off' ? 'text-accent-light' : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
              {repeatMode !== 'off' && (
                <span className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted w-full">
            <span className="w-8 text-right tabular-nums">{formatDuration(currentSeconds)}</span>
            <div
              className="flex-1 relative h-1 bg-white/[0.08] rounded-full cursor-pointer group/seek"
              onClick={handleSeek}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover/seek:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 5px)` }}
              />
            </div>
            <span className="w-8 tabular-nums">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-[240px] flex-shrink-0 flex items-center justify-end gap-2">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div
            className="w-20 relative h-1 bg-white/[0.08] rounded-full cursor-pointer group/vol"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setVolume((e.clientX - rect.left) / rect.width)
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent"
              style={{ width: `${volume * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover/vol:opacity-100 transition-opacity"
              style={{ left: `calc(${volume * 100}% - 5px)` }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
