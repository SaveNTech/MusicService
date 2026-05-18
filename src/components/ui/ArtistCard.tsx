import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { Cover } from './Cover'
import { formatPlays } from '@/utils'
import type { Artist } from '@/types'

export function ArtistCard({ artist }: { artist: Artist }) {
  const navigate = useNavigate()

  return (
    <div
      className="group flex flex-col items-center gap-3 p-4 rounded-lg cursor-pointer card-hover text-center"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="relative">
        <Cover
          src={artist.cover_url}
          color={artist.color}
          className="w-32 h-32 ring-1 ring-white/10 group-hover:ring-accent/50 transition-all"
          rounded="full"
          alt={artist.name}
        />
        {artist.verified && (
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
            <BadgeCheck className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-text-primary text-sm">{artist.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">{artist.bio}</p>
        <p className="text-xs text-text-muted mt-1">{formatPlays(artist.monthly_listeners)} слушателей</p>
      </div>
    </div>
  )
}
