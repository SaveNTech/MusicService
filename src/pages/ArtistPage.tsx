import { useParams } from 'react-router-dom'
import { Play, Pause, BadgeCheck, UserPlus } from 'lucide-react'
import { GradientCover } from '@/components/ui/GradientCover'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePlayerStore } from '@/store/playerStore'
import { getArtistById, getArtistAlbums, tracks, formatPlays } from '@/data/mockData'

export function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const artist = id ? getArtistById(id) : null
  if (!artist) return (
    <div className="flex items-center justify-center h-full text-text-secondary">
      Артист не найден
    </div>
  )

  const artistAlbums = getArtistAlbums(artist.id)
  const artistTracks = tracks.filter(t => t.artistId === artist.id)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 5)

  const isArtistPlaying = artistTracks.some(t => t.id === currentTrack?.id) && isPlaying

  function handlePlay() {
    if (isArtistPlaying) {
      togglePlay()
    } else if (artistTracks.length > 0) {
      playTrack(artistTracks[0], artistTracks)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Artist header */}
      <div
        className="relative h-72 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${artist.gradient[0]}, ${artist.gradient[1]})` }}
      >
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end px-8 pb-8">
          <div className="flex items-end gap-6">
            <GradientCover gradient={artist.gradient} size="xl" rounded="full"
              className="ring-4 ring-white/10 shadow-2xl" />
            <div>
              {artist.verified && (
                <div className="flex items-center gap-1.5 mb-2">
                  <BadgeCheck className="w-4 h-4 text-sky-accent fill-sky-accent" />
                  <span className="text-xs font-semibold text-sky-accent uppercase tracking-wider">Верифицирован</span>
                </div>
              )}
              <h1 className="text-5xl font-extrabold text-white leading-none">{artist.name}</h1>
              <p className="text-white/70 text-sm mt-2">{artist.bio}</p>
              <p className="text-white/50 text-xs mt-1">{formatPlays(artist.monthlyListeners)} слушателей в месяц</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-8 py-6">
        <button
          onClick={handlePlay}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 glow-accent"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
        >
          {isArtistPlaying
            ? <Pause className="w-6 h-6 text-white fill-white" />
            : <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          }
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-sm font-medium text-text-secondary hover:text-white hover:border-white/40 transition-all">
          <UserPlus className="w-4 h-4" />
          Подписаться
        </button>
      </div>

      {/* Popular tracks */}
      <div className="px-8 mb-8">
        <SectionHeader title="Популярные треки" />
        <div className="space-y-0.5">
          {artistTracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} queue={artistTracks} showAlbum showPlays />
          ))}
        </div>
      </div>

      {/* Albums */}
      <div className="px-8 pb-8">
        <SectionHeader title="Дискография" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {artistAlbums.map(al => (
            <div key={al.id} className="flex-shrink-0">
              <AlbumCard album={al} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
