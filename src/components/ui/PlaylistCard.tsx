import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Cover } from './Cover'
import { usePlayerStore } from '@/store/playerStore'
import type { Playlist, Track } from '@/types'

interface PlaylistCardProps {
  playlist: Playlist
  tracks?: Track[]
}

export function PlaylistCard({ playlist, tracks = [] }: PlaylistCardProps) {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (tracks.length > 0) playTrack(tracks[0], tracks)
  }

  return (
    <div
      className="group flex flex-col gap-3 p-3 rounded-lg cursor-pointer card-hover"
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >
      <div className="relative w-44 h-44">
        <Cover
          src={playlist.cover_url}
          color={playlist.color}
          className="w-full h-full"
          rounded="md"
          alt={playlist.title}
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
      <div>
        <p className="font-semibold text-text-primary text-sm truncate">{playlist.title}</p>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{playlist.description}</p>
      </div>
    </div>
  )
}
