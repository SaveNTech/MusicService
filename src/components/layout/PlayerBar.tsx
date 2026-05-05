import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart, Maximize2,
} from 'lucide-react'
import { clsx } from 'clsx'
import { usePlayerStore } from '@/store/playerStore'
import { getAlbumById, getArtistById, formatDuration } from '@/data/mockData'
import { TrackCover } from '@/components/ui/TrackCover'
import { NowPlayingIcon } from '@/components/ui/NowPlayingIcon'

export function PlayerBar() {
  const {
    currentTrack, isPlaying, volume, progress,
    isShuffle, repeatMode,
    togglePlay, setVolume, setProgress,
    nextTrack, prevTrack, toggleShuffle, cycleRepeat,
    toggleFavorite, isFavorite,
  } = usePlayerStore()

  const album = currentTrack ? getAlbumById(currentTrack.albumId) : null
  const artist = currentTrack ? getArtistById(currentTrack.artistId) : null
  const liked = currentTrack ? isFavorite(currentTrack.id) : false

  const progressPercent = Math.round(progress * 100)
  const duration = currentTrack?.duration ?? 0
  const currentSeconds = Math.round(progress * duration)

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setProgress((e.clientX - rect.left) / rect.width)
  }

  return (
    <footer className="h-[88px] flex-shrink-0 glass-strong border-t border-white/5 relative z-20">
      {/* Thin progress line at very top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] cursor-pointer group/bar" onClick={handleProgressClick}>
        <div className="absolute inset-0 bg-white/5" />
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progressPercent}%`,
            background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
          }}
        />
      </div>

      <div className="flex items-center h-full px-4 gap-4">
        {/* Left: track info */}
        <div className="w-[260px] flex-shrink-0 flex items-center gap-3">
          {currentTrack && album ? (
            <>
              <div className="relative w-10 h-10 flex-shrink-0">
                <TrackCover
                  coverSrc={currentTrack.coverSrc}
                  gradient={album.gradient}
                  className="w-10 h-10 rounded-md"
                  alt={currentTrack.title}
                />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center">
                    <NowPlayingIcon isPlaying size={12} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">{currentTrack.title}</p>
                <p className="text-xs text-text-secondary truncate">{artist?.name}</p>
              </div>
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  liked ? 'text-rose-400' : 'text-text-secondary hover:text-white',
                )}
              >
                <Heart className={clsx('w-4 h-4', liked && 'fill-current')} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-10 h-10 rounded-md bg-bg-elevated" />
              <div>
                <div className="h-3 w-24 rounded bg-bg-elevated mb-1.5" />
                <div className="h-2.5 w-16 rounded bg-bg-elevated" />
              </div>
            </div>
          )}
        </div>

        {/* Center: controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-[500px] mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleShuffle}
              className={clsx(
                'p-2 rounded-full transition-all',
                isShuffle ? 'text-accent-light' : 'text-text-secondary hover:text-text-primary',
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button onClick={prevTrack} className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!currentTrack}
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150',
                currentTrack
                  ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg'
                  : 'bg-white/20 text-white/40 cursor-not-allowed',
              )}
            >
              {isPlaying
                ? <Pause className="w-5 h-5 fill-current" />
                : <Play className="w-5 h-5 fill-current ml-0.5" />
              }
            </button>

            <button onClick={nextTrack} className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={cycleRepeat}
              className={clsx(
                'p-2 rounded-full transition-all relative',
                repeatMode !== 'off' ? 'text-accent-light' : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              {repeatMode !== 'off' && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-accent-light" />
              )}
            </button>
          </div>

          {/* Time + scrubber */}
          <div className="flex items-center gap-2 text-xs text-text-muted w-full justify-center">
            <span className="w-8 text-right tabular-nums">{formatDuration(currentSeconds)}</span>
            <div
              className="flex-1 max-w-[280px] relative h-1 bg-white/10 rounded-full cursor-pointer group/seek"
              onClick={handleProgressClick}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/seek:opacity-100 transition-opacity shadow"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>
            <span className="w-8 tabular-nums">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right: volume */}
        <div className="w-[260px] flex-shrink-0 flex items-center justify-end gap-2">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div
            className="w-24 relative h-1 bg-white/10 rounded-full cursor-pointer group/vol"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setVolume((e.clientX - rect.left) / rect.width)
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${volume * 100}%`,
                background: 'linear-gradient(to right, #7c3aed, #06b6d4)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover/vol:opacity-100 transition-opacity shadow"
              style={{ left: `calc(${volume * 100}% - 6px)` }}
            />
          </div>

          <button className="ml-2 text-text-secondary hover:text-text-primary transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
