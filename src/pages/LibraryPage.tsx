import { useState } from 'react'
import { Heart, Play } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { PlaylistCard } from '@/components/ui/PlaylistCard'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { ArtistCard } from '@/components/ui/ArtistCard'
import { TrackRow } from '@/components/ui/TrackRow'
import { usePlayerStore } from '@/store/playerStore'
import { playlistsApi, albumsApi, artistsApi, tracksApi } from '@/api'
import { useAuthStore } from '@/store/authStore'

const tabs = ['Плейлисты', 'Альбомы', 'Артисты', 'Любимые'] as const
type Tab = typeof tabs[number]

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Плейлисты')
  const favorites = usePlayerStore(s => s.favorites)
  const playTrack = usePlayerStore(s => s.playTrack)
  const user = useAuthStore(s => s.user)

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => playlistsApi.list().then(r => r.data),
  })
  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.list().then(r => r.data),
    enabled: activeTab === 'Альбомы',
  })
  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
    enabled: activeTab === 'Артисты',
  })
  const { data: favTracks = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => tracksApi.favorites().then(r => r.data),
    enabled: activeTab === 'Любимые' && !!user,
  })

  return (
    <div className="px-8 py-6 animate-fade-in-up">
      <h1 className="text-xl font-bold text-text-primary mb-5">Библиотека</h1>

      <div className="flex gap-1 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-accent text-white'
                : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
            {tab === 'Любимые' && favorites.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {favorites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Плейлисты' && (
        <div className="flex flex-wrap gap-2">
          {playlists.map(pl => <PlaylistCard key={pl.id} playlist={pl} />)}
          {playlists.length === 0 && <p className="text-text-muted text-sm">Нет плейлистов</p>}
        </div>
      )}

      {activeTab === 'Альбомы' && (
        <div className="flex flex-wrap gap-2">
          {albums.map(al => <AlbumCard key={al.id} album={al} />)}
          {albums.length === 0 && <p className="text-text-muted text-sm">Нет альбомов</p>}
        </div>
      )}

      {activeTab === 'Артисты' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {artists.map(ar => <ArtistCard key={ar.id} artist={ar} />)}
          {artists.length === 0 && <p className="text-text-muted text-sm">Нет артистов</p>}
        </div>
      )}

      {activeTab === 'Любимые' && (
        <div>
          {favTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-text-primary font-semibold">Нет любимых треков</p>
              <p className="text-text-muted text-sm mt-1">Нажимай ♥ рядом с треком</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-5 mb-6 p-4 rounded-xl bg-bg-card border border-border">
                <div className="w-16 h-16 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-red-400 fill-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">Плейлист</p>
                  <h2 className="text-lg font-bold text-text-primary">Любимые треки</h2>
                  <p className="text-text-secondary text-sm">{favTracks.length} треков</p>
                </div>
                <button
                  onClick={() => favTracks.length > 0 && playTrack(favTracks[0], favTracks)}
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </button>
              </div>
              <div className="space-y-0.5">
                {favTracks.map((track, i) => (
                  <TrackRow key={track.id} track={track} index={i} queue={favTracks} showCover showPlays />
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
