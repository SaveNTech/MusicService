import { Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TrackRow } from '@/components/ui/TrackRow'
import { Cover } from '@/components/ui/Cover'
import { usePlayerStore } from '@/store/playerStore'
import { tracksApi, albumsApi, playlistsApi, artistsApi } from '@/api'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

const moods = [
  { label: 'Энергетика', color: '#ef4444' },
  { label: 'Расслабление', color: '#3b82f6' },
  { label: 'Фокус', color: '#14b8a6' },
  { label: 'Вечеринка', color: '#ec4899' },
  { label: 'Тренировка', color: '#f59e0b' },
  { label: 'Сон', color: '#4f46e5' },
]

export function HomePage() {
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)

  const { data: tracks = [] } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => tracksApi.list().then(r => r.data),
  })
  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.list().then(r => r.data),
  })
  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => playlistsApi.list().then(r => r.data),
  })
  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
  })

  const trending = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 5)
  const featured = playlists[0]

  return (
    <div className="px-8 py-6 space-y-10 animate-fade-in-up">
      <section>
        <h1 className="text-2xl font-bold text-text-primary mb-5">{getGreeting()}</h1>

        {/* Hero */}
        {featured ? (
          <div
            className="relative h-56 rounded-xl overflow-hidden cursor-pointer group mb-4"
            style={{ background: `linear-gradient(135deg, ${featured.color}cc, ${featured.color}44)` }}
            onClick={() => navigate(`/playlist/${featured.id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Плейлист недели</p>
              <h2 className="text-3xl font-extrabold text-white leading-tight">{featured.title}</h2>
              {featured.description && <p className="text-white/60 text-sm mt-1">{featured.description}</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); if (tracks.length > 0) playTrack(tracks[0], tracks) }}
              className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center
                         shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200"
            >
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </button>
          </div>
        ) : (
          <div className="h-56 rounded-xl bg-bg-card border border-border mb-4 flex items-center justify-center">
            <p className="text-text-muted text-sm">Добавьте плейлисты через панель администратора</p>
          </div>
        )}

        {/* Quick access */}
        {playlists.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {playlists.slice(0, 4).map((pl) => (
              <button
                key={pl.id}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                className="flex items-center gap-3 bg-bg-card hover:bg-bg-elevated rounded-lg overflow-hidden transition-colors border border-border h-12"
              >
                <Cover
                  src={pl.cover_url}
                  color={pl.color}
                  className="w-12 h-12 flex-shrink-0 rounded-none"
                  alt={pl.title}
                />
                <span className="text-sm font-semibold text-text-primary pr-3 truncate">{pl.title}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {trending.length > 0 && (
        <section>
          <SectionHeader title="В тренде" />
          <div className="space-y-0.5">
            {trending.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={trending} showPlays />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <SectionHeader title="Новые релизы" href="/library" />
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {albums.map((album) => (
              <div key={album.id} className="flex-shrink-0">
                <AlbumCard album={album} tracks={tracks.filter(t => t.album_id === album.id)} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Настроение" />
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className="relative h-16 rounded-lg overflow-hidden group transition-transform hover:scale-105 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${mood.color}cc, ${mood.color}66)` }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <span className="relative text-sm font-bold text-white">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {playlists.length > 0 && (
        <section>
          <SectionHeader title="Наши плейлисты" href="/library" />
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {playlists.map((pl) => (
              <div key={pl.id} className="flex-shrink-0">
                <PlaylistCard playlist={pl} tracks={tracks} />
              </div>
            ))}
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <section>
          <SectionHeader title="Популярные артисты" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {tracks.length === 0 && albums.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary">Библиотека пуста.</p>
          <p className="text-text-muted text-sm mt-1">Загрузите треки через панель администратора.</p>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
