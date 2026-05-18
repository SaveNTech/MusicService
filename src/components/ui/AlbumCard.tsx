import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Cover } from './Cover'
import { usePlayerStore } from '@/store/playerStore'
import type { Album, Track } from '@/types'

interface AlbumCardProps {
  album: Album
  tracks?: Track[]
}

export function AlbumCard({ album, tracks = [] }: AlbumCardProps) {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)

  const isActive = tracks.some(t => t.id === currentTrack?.id) && isPlaying

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (tracks.length > 0) playTrack(tracks[0], tracks)
  }

  return (
    <div
      className="group flex flex-col gap-3 p-3 rounded-lg cursor-pointer card-hover"
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className="relative w-44 h-44 flex-shrink-0">
        <Cover
          src={album.cover_url}
          color={album.color}
          className={`w-full h-full ${isActive ? 'ring-2 ring-accent' : ''}`}
          rounded="md"
          alt={album.title}
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-accent flex items-center justify-center
                     opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                     transition-all duration-200 shadow-lg"
        >
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </button>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-text-primary truncate text-sm">{album.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 truncate">{album.artist.name} · {album.year}</p>
      </div>
    </div>
  )
}
