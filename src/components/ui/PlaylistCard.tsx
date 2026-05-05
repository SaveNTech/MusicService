import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GradientCover } from './GradientCover'
import { usePlayerStore } from '@/store/playerStore'
import { getTrackById } from '@/data/mockData'
import type { Playlist } from '@/types'

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    const tracks = playlist.trackIds.map(id => getTrackById(id)).filter(Boolean) as ReturnType<typeof getTrackById>[]
    const valid = tracks.filter(Boolean) as NonNullable<typeof tracks[number]>[]
    if (valid.length > 0) playTrack(valid[0], valid)
  }

  return (
    <div
      className="group flex flex-col gap-3 p-3 rounded-xl cursor-pointer card-hover"
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >
      <div className="relative w-44 h-44">
        <GradientCover gradient={playlist.gradient} rounded="lg" className="w-full h-full" />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     transition-all duration-200 glow-accent shadow-xl"
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
