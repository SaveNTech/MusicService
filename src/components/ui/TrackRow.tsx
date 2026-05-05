import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { TrackCover } from './TrackCover'
import { NowPlayingIcon } from './NowPlayingIcon'
import { usePlayerStore } from '@/store/playerStore'
import { getAlbumById, getArtistById, formatDuration, formatPlays } from '@/data/mockData'
import type { Track } from '@/types'

interface TrackRowProps {
  track: Track
  index?: number
  queue?: Track[]
  showAlbum?: boolean
  showPlays?: boolean
}

export function TrackRow({ track, index, queue, showAlbum = false, showPlays = false }: TrackRowProps) {
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const toggleFavorite = usePlayerStore(s => s.toggleFavorite)
  const isFavorite = usePlayerStore(s => s.isFavorite(track.id))

  const album = getAlbumById(track.albumId)
  const artist = getArtistById(track.artistId)

  const isActive = currentTrack?.id === track.id
  const isCurrentlyPlaying = isActive && isPlaying

  return (
    <div
      className={clsx(
        'group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
        isActive ? 'bg-accent/10' : 'hover:bg-white/5',
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
              onClick={(e) => { e.stopPropagation(); playTrack(track, queue ?? [track]) }}
            />
          </>
        )}
      </div>

      {/* Cover */}
      {showAlbum && album && (
        <TrackCover
          coverSrc={track.coverSrc}
          gradient={album.gradient}
          className="w-10 h-10 rounded"
          alt={track.title}
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium truncate', isActive ? 'text-accent-light' : 'text-text-primary')}>
          {track.title}
        </p>
        <p className="text-xs text-text-secondary truncate">{artist?.name}</p>
      </div>

      {/* Album name */}
      {showAlbum && album && (
        <p className="hidden md:block text-xs text-text-secondary truncate w-32 text-right">{album.title}</p>
      )}

      {/* Plays */}
      {showPlays && (
        <p className="hidden lg:block text-xs text-text-secondary w-16 text-right">{formatPlays(track.plays)}</p>
      )}

      {/* Favorite */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id) }}
          className={clsx(
            'p-1.5 rounded-full transition-colors',
            isFavorite
              ? 'text-rose-400 opacity-100'
              : 'text-text-secondary opacity-0 group-hover:opacity-100 hover:text-white',
          )}
        >
          <Heart className={clsx('w-3.5 h-3.5', isFavorite && 'fill-current')} />
        </button>
      </div>

      {/* Duration */}
      <span className="text-xs text-text-secondary w-8 text-right flex-shrink-0">
        {formatDuration(track.duration)}
      </span>

      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 rounded-full hover:bg-white/10 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}
