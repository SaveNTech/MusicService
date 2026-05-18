import { useParams } from 'react-router-dom'
import { Play, Pause, BadgeCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Cover } from '@/components/ui/Cover'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePlayerStore } from '@/store/playerStore'
import { artistsApi } from '@/api'
import { formatPlays } from '@/utils'

export function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const artistId = parseInt(id ?? '0')

  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => artistsApi.get(artistId).then(r => r.data),
    enabled: !!artistId,
  })
  const { data: artistAlbums = [] } = useQuery({
    queryKey: ['artist-albums', artistId],
    queryFn: () => artistsApi.albums(artistId).then(r => r.data),
    enabled: !!artistId,
  })
  const { data: artistTracks = [] } = useQuery({
    queryKey: ['artist-tracks', artistId],
    queryFn: () => artistsApi.tracks(artistId).then(r => r.data),
    enabled: !!artistId,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!artist) return (
    <div className="flex items-center justify-center h-48 text-text-secondary">Артист не найден</div>
  )

  const topTracks = [...artistTracks].sort((a, b) => b.plays - a.plays).slice(0, 5)
  const isArtistPlaying = topTracks.some(t => t.id === currentTrack?.id) && isPlaying

  function handlePlay() {
    if (isArtistPlaying) togglePlay()
    else if (topTracks.length > 0) playTrack(topTracks[0], topTracks)
  }

  return (
    <div className="animate-fade-in-up">
      <div
        className="relative h-64 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${artist.color}cc, ${artist.color}44, #0a0a0a)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end px-8 pb-7">
          <div className="flex items-end gap-5">
            <Cover
              src={artist.cover_url}
              color={artist.color}
              className="w-28 h-28 flex-shrink-0 shadow-2xl ring-2 ring-white/10"
              rounded="full"
              alt={artist.name}
            />
            <div>
              {artist.verified && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-accent fill-accent" />
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">Верифицирован</span>
                </div>
              )}
              <h1 className="text-4xl font-extrabold text-white leading-none">{artist.name}</h1>
              {artist.bio && <p className="text-white/60 text-sm mt-1.5 max-w-md line-clamp-2">{artist.bio}</p>}
              <p className="text-white/40 text-xs mt-1">{formatPlays(artist.monthly_listeners)} слушателей в месяц</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-8 py-5">
        <button
          onClick={handlePlay}
          disabled={topTracks.length === 0}
          className="w-11 h-11 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
        >
          {isArtistPlaying
            ? <Pause className="w-5 h-5 text-white fill-white" />
            : <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          }
        </button>
      </div>

      {topTracks.length > 0 && (
        <div className="px-8 mb-8">
          <SectionHeader title="Популярные треки" />
          <div className="space-y-0.5">
            {topTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={topTracks} showPlays />
            ))}
          </div>
        </div>
      )}

      {artistAlbums.length > 0 && (
        <div className="px-8 pb-8">
          <SectionHeader title="Дискография" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {artistAlbums.map(al => (
              <div key={al.id} className="flex-shrink-0">
                <AlbumCard album={al} tracks={artistTracks.filter(t => t.album_id === al.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
