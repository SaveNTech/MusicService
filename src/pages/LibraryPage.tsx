import { useState } from 'react'
import { Heart, Plus } from 'lucide-react'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { TrackRow } from '@/components/ui/TrackRow'
import { usePlayerStore } from '@/store/playerStore'
import { playlists, albums, artists, tracks } from '@/data/mockData'

const tabs = ['Плейлисты', 'Альбомы', 'Артисты', 'Любимые'] as const
type Tab = typeof tabs[number]

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Плейлисты')
  const favorites = usePlayerStore(s => s.favorites)
  const playTrack = usePlayerStore(s => s.playTrack)

  const favoriteTracks = tracks.filter(t => favorites.includes(t.id))

  function playFavorites() {
    if (favoriteTracks.length > 0) playTrack(favoriteTracks[0], favoriteTracks)
  }

  return (
    <div className="px-8 py-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Библиотека</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-text-secondary hover:text-text-primary">
          <Plus className="w-4 h-4" />
          Создать
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-black'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
            }`}
          >
            {tab}
            {tab === 'Любимые' && favorites.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {favorites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Плейлисты */}
      {activeTab === 'Плейлисты' && (
        <div className="flex flex-wrap gap-2">
          {playlists.map(pl => <PlaylistCard key={pl.id} playlist={pl} />)}
        </div>
      )}

      {/* Альбомы */}
      {activeTab === 'Альбомы' && (
        <div className="flex flex-wrap gap-2">
          {albums.map(al => <AlbumCard key={al.id} album={al} />)}
        </div>
      )}

      {/* Артисты */}
      {activeTab === 'Артисты' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {artists.map(ar => <ArtistCard key={ar.id} artist={ar} />)}
        </div>
      )}

      {/* Любимые */}
      {activeTab === 'Любимые' && (
        <div>
          {favoriteTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}
              >
                <Heart className="w-7 h-7 text-accent-light" />
              </div>
              <p className="text-text-primary font-semibold text-lg">Нет любимых треков</p>
              <p className="text-text-secondary text-sm mt-2">
                Нажимай ♥ рядом с треком — и он появится здесь
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-6 mb-6 p-4 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #1e1b4b44, #7c3aed22)' }}>
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}
                >
                  <Heart className="w-9 h-9 text-accent-light fill-accent-light" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Плейлист</p>
                  <h2 className="text-2xl font-bold text-text-primary">Любимые треки</h2>
                  <p className="text-text-secondary text-sm mt-1">{favoriteTracks.length} треков</p>
                </div>
                <button
                  onClick={playFavorites}
                  className="ml-auto w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 glow-accent"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                >
                  <Heart className="w-5 h-5 text-white fill-white" />
                </button>
              </div>

              <div className="space-y-0.5">
                {favoriteTracks.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={favoriteTracks} showAlbum showPlays />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
