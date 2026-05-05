import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TrackRow } from '@/components/ui/TrackRow'
import { usePlayerStore } from '@/store/playerStore'
import { albums, artists, playlists, tracks, getTrackById } from '@/data/mockData'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

const featuredPlaylist = playlists[0]

const moods = [
  { label: 'Энергетика', gradient: ['#ef4444', '#f97316'] as [string, string] },
  { label: 'Расслабление', gradient: ['#3b82f6', '#8b5cf6'] as [string, string] },
  { label: 'Фокус', gradient: ['#14b8a6', '#6366f1'] as [string, string] },
  { label: 'Вечеринка', gradient: ['#ec4899', '#f97316'] as [string, string] },
  { label: 'Тренировка', gradient: ['#f59e0b', '#ef4444'] as [string, string] },
  { label: 'Сон', gradient: ['#4f46e5', '#1e1b4b'] as [string, string] },
]

export function HomePage() {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)

  const featuredTracks = featuredPlaylist.trackIds
    .map(id => getTrackById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTrackById>>[]

  function handlePlayFeatured() {
    if (featuredTracks.length > 0) playTrack(featuredTracks[0], featuredTracks)
  }

  return (
    <div className="px-8 py-6 space-y-10 animate-fade-in-up">
      {/* Greeting + hero */}
      <section>
        <h1 className="text-3xl font-bold text-text-primary mb-6">{getGreeting()}</h1>

        {/* Hero */}
        <div
          className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
          style={{ background: `linear-gradient(135deg, ${featuredPlaylist.gradient[0]}, ${featuredPlaylist.gradient[1]})` }}
          onClick={() => navigate(`/playlist/${featuredPlaylist.id}`)}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Плейлист недели</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight">{featuredPlaylist.title}</h2>
            <p className="text-white/70 text-sm mt-1">{featuredPlaylist.description}</p>
            <p className="text-white/50 text-xs mt-2">{featuredTracks.length} треков</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayFeatured() }}
            className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white flex items-center justify-center
                       shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200"
          >
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </button>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => navigate(`/playlist/${pl.id}`)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-colors"
            >
              <div className="w-12 h-12 flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${pl.gradient[0]}, ${pl.gradient[1]})` }} />
              <span className="text-sm font-semibold text-text-primary pr-3 truncate">{pl.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending tracks */}
      <section>
        <SectionHeader title="В тренде" />
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} queue={tracks} showAlbum showPlays />
          ))}
        </div>
      </section>

      {/* Releases */}
      <section>
        <SectionHeader title="Новые релизы" href="/library" />
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {albums.map((album) => (
            <div key={album.id} className="flex-shrink-0">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      </section>

      {/* Moods */}
      <section>
        <SectionHeader title="Настроение" />
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className="relative h-20 rounded-xl overflow-hidden group transition-transform hover:scale-105 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${mood.gradient[0]}, ${mood.gradient[1]})` }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <span className="relative text-sm font-bold text-white">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section>
        <SectionHeader title="Наши плейлисты" href="/library" />
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {playlists.map((pl) => (
            <div key={pl.id} className="flex-shrink-0">
              <PlaylistCard playlist={pl} />
            </div>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section>
        <SectionHeader title="Популярные артисты" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}
