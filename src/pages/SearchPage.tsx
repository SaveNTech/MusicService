import { useState } from 'react'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { tracksApi, albumsApi, artistsApi } from '@/api'

const genres = [
  { id: 'pop', name: 'Поп', color: '#ec4899' },
  { id: 'rock', name: 'Рок', color: '#ef4444' },
  { id: 'hiphop', name: 'Хип-хоп', color: '#f97316' },
  { id: 'electronic', name: 'Электроника', color: '#8b5cf6' },
  { id: 'rnb', name: 'R&B', color: '#3b82f6' },
  { id: 'jazz', name: 'Джаз', color: '#14b8a6' },
  { id: 'classical', name: 'Классика', color: '#6366f1' },
  { id: 'country', name: 'Кантри', color: '#d97706' },
]

export function SearchPage() {
  const [query, setQuery] = useState('')

  const { data: tracks = [] } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => tracksApi.list().then(r => r.data),
  })
  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.list().then(r => r.data),
  })
  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
  })

  const q = query.trim().toLowerCase()
  const filteredTracks = q ? tracks.filter(t =>
    t.title.toLowerCase().includes(q) || t.artist.name.toLowerCase().includes(q)
  ) : []
  const filteredAlbums = q ? albums.filter(a =>
    a.title.toLowerCase().includes(q) || a.artist.name.toLowerCase().includes(q)
  ) : []
  const filteredArtists = q ? artists.filter(a => a.name.toLowerCase().includes(q)) : []

  const hasResults = filteredTracks.length > 0 || filteredAlbums.length > 0 || filteredArtists.length > 0

  return (
    <div className="px-8 py-6 space-y-8 animate-fade-in-up">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Что хочешь послушать?"
          className="w-full bg-bg-card text-text-primary placeholder-text-muted rounded-lg
                     pl-10 pr-4 py-3 text-sm border border-border outline-none
                     focus:border-accent/50 transition-colors"
          autoFocus
        />
      </div>

      {query.trim() ? (
        <div className="space-y-8">
          {!hasResults && (
            <p className="text-text-secondary text-sm text-center py-10">
              Ничего не найдено по запросу «{query}»
            </p>
          )}

          {filteredTracks.length > 0 && (
            <section>
              <SectionHeader title="Треки" />
              <div className="space-y-0.5">
                {filteredTracks.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={filteredTracks} showCover showPlays />
                ))}
              </div>
            </section>
          )}

          {filteredArtists.length > 0 && (
            <section>
              <SectionHeader title="Артисты" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredArtists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {filteredAlbums.length > 0 && (
            <section>
              <SectionHeader title="Альбомы" />
              <div className="flex flex-wrap gap-2">
                {filteredAlbums.map(album => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section>
          <SectionHeader title="Жанры" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="relative h-24 rounded-xl overflow-hidden group transition-transform hover:scale-[1.02] flex items-start p-4"
                style={{ background: `linear-gradient(135deg, ${genre.color}cc, ${genre.color}55)` }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div
                  className="absolute -bottom-3 -right-3 w-16 h-16 rounded-xl rotate-[20deg] opacity-25"
                  style={{ background: 'rgba(255,255,255,0.4)' }}
                />
                <span className="relative text-base font-extrabold text-white drop-shadow">{genre.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />
    </div>
  )
}
