import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { GradientCover } from './GradientCover'
import { formatPlays } from '@/data/mockData'
import type { Artist } from '@/types'

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="group flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer card-hover text-center"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative">
        <GradientCover gradient={artist.gradient} size="lg" rounded="full" className="ring-2 ring-transparent group-hover:ring-accent transition-all duration-300" />
        {artist.verified && (
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-sky-accent flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-text-primary text-sm">{artist.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">{artist.bio}</p>
        <p className="text-xs text-text-muted mt-1">{formatPlays(artist.monthlyListeners)} слушателей</p>
      </div>
    </div>
  )
}
