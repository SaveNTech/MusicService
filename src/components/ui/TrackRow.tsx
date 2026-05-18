import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { Cover } from './Cover'
import { NowPlayingIcon } from './NowPlayingIcon'
import { usePlayerStore } from '@/store/playerStore'
import { formatDuration, formatPlays } from '@/utils'
import type { Track } from '@/types'

interface TrackRowProps {
  track: Track
  index?: number
  queue?: Track[]
  showCover?: boolean
  showPlays?: boolean
}

export function TrackRow({ track, index, queue, showCover = false, showPlays = false }: TrackRowProps) {
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const toggleFavorite = usePlayerStore(s => s.toggleFavorite)
  const isFav = usePlayerStore(s => s.isFavorite(track.id))

  const isActive = currentTrack?.id === track.id
  const isCurrentlyPlaying = isActive && isPlaying

  return (
    <div
      className={clsx(
        'group flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-150',
        isActive ? 'bg-accent-dim' : 'hover:bg-white/[0.04]',
      )}
      onDoubleClick={() => playTrack(track, queue ?? [track])}
    >
      {/* Index / icon */}
      <div className="w-6 flex-shrink-0 flex items-center justify-center">
        {isActive ? (
          <NowPlayingIcon isPlaying={isCurrentlyPlaying} size={14} />
        ) : (
          <>
            <span className={clsx('text-sm text-text-secondary group-hover:hidden', index === undefined && 'hidden')}>
              {index !== undefined ? index + 1 : ''}
            </span>
            <Play
              className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block"
              onClick={e => { e.stopPropagation(); playTrack(track, queue ?? [track]) }}
            />
          </>
        )}
      </div>

      {showCover && (
        <Cover
          src={track.cover_url ?? track.album.cover_url}
          color={track.album.color}
          className="w-9 h-9"
          rounded="sm"
          alt={track.title}
        />
      )}

      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium truncate', isActive ? 'text-accent-light' : 'text-text-primary')}>
          {track.title}
        </p>
        <p className="text-xs text-text-secondary truncate">{track.artist.name}</p>
      </div>

      {showPlays && (
        <p className="hidden lg:block text-xs text-text-secondary w-14 text-right tabular-nums">
          {formatPlays(track.plays)}
        </p>
      )}

      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(track.id) }}
        className={clsx(
          'p-1.5 rounded transition-colors',
          isFav
            ? 'text-red-400'
            : 'text-text-secondary opacity-0 group-hover:opacity-100 hover:text-white',
        )}
      >
        <Heart className={clsx('w-3.5 h-3.5', isFav && 'fill-current')} />
      </button>

      <span className="text-xs text-text-secondary w-8 text-right flex-shrink-0 tabular-nums">
        {formatDuration(track.duration)}
      </span>

      <button
        onClick={e => e.stopPropagation()}
        className="p-1 rounded text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}
