import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TrackCover } from './TrackCover'
import { usePlayerStore } from '@/store/playerStore'
import { getAlbumTracks, getArtistById } from '@/data/mockData'
import type { Album } from '@/types'

interface AlbumCardProps {
  album: Album
}

export function AlbumCard({ album }: AlbumCardProps) {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const artist = getArtistById(album.artistId)
  const albumTracks = getAlbumTracks(album.id)

  const firstCover = albumTracks.find(t => t.coverSrc)?.coverSrc
  const isActive = albumTracks.some(t => t.id === currentTrack?.id) && isPlaying

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (albumTracks.length > 0) playTrack(albumTracks[0], albumTracks)
  }

  return (
    <div
      className="group flex flex-col gap-3 p-3 rounded-xl cursor-pointer card-hover"
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className="relative w-44 h-44 flex-shrink-0">
        <TrackCover
          coverSrc={firstCover}
          gradient={album.gradient}
          className={`w-full h-full rounded-xl ${isActive ? 'ring-2 ring-accent-light' : ''}`}
          alt={album.title}
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     transition-all duration-200 glow-accent shadow-xl"
        >
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </button>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-text-primary truncate text-sm leading-tight">{album.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{artist?.name} · {album.year}</p>
      </div>
    </div>
  )
}
