import { useState } from 'react'
import { Search } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { genres, tracks, albums } from '@/data/mockData'

export function SearchPage() {
  const [query, setQuery] = useState('')

  const filteredTracks = query.trim()
    ? tracks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const filteredAlbums = query.trim()
    ? albums.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const hasResults = filteredTracks.length > 0 || filteredAlbums.length > 0

  return (
    <div className="px-8 py-6 space-y-8 animate-fade-in-up">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Что хочешь послушать?"
          className="w-full bg-bg-elevated text-text-primary placeholder-text-muted rounded-xl
                     pl-12 pr-4 py-4 text-base font-medium border border-white/5 outline-none
                     focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          autoFocus
        />
      </div>

      {/* Results */}
      {query.trim() && (
        <div>
          {!hasResults && (
            <p className="text-text-secondary text-center py-12">
              Ничего не найдено по запросу «{query}»
            </p>
          )}

          {filteredTracks.length > 0 && (
            <section className="mb-8">
              <SectionHeader title="Треки" />
              <div className="space-y-1">
                {filteredTracks.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={filteredTracks} showAlbum showPlays />
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
      )}

      {/* Genre grid — shown when no query */}
      {!query.trim() && (
        <section>
          <SectionHeader title="Жанры" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="relative h-28 rounded-2xl overflow-hidden group transition-transform hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${genre.gradient[0]}, ${genre.gradient[1]})` }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />
                {/* Decorative rotated square */}
                <div
                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl rotate-[20deg] opacity-30"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                />
                <div className="absolute inset-0 p-4 flex items-start">
                  <span className="text-base font-extrabold text-white drop-shadow">{genre.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />
    </div>
  )
}
