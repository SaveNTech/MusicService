import { useParams, useNavigate } from 'react-router-dom'
import { Play, Pause, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Cover } from '@/components/ui/Cover'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePlayerStore } from '@/store/playerStore'
import { albumsApi, artistsApi } from '@/api'
import { formatDuration } from '@/utils'

export function AlbumPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const albumId = parseInt(id ?? '0')

  const { data: album, isLoading: albumLoading } = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => albumsApi.get(albumId).then(r => r.data),
    enabled: !!albumId,
  })
  const { data: albumTracks = [] } = useQuery({
    queryKey: ['album-tracks', albumId],
    queryFn: () => albumsApi.tracks(albumId).then(r => r.data),
    enabled: !!albumId,
  })
  const { data: artistAlbums = [] } = useQuery({
    queryKey: ['artist-albums', album?.artist_id],
    queryFn: () => artistsApi.albums(album!.artist_id).then(r => r.data),
    enabled: !!album?.artist_id,
  })

  if (albumLoading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!album) return (
    <div className="flex items-center justify-center h-48 text-text-secondary">Альбом не найден</div>
  )

  const isAlbumPlaying = albumTracks.some(t => t.id === currentTrack?.id) && isPlaying
  const totalDuration = albumTracks.reduce((s, t) => s + t.duration, 0)
  const relatedAlbums = artistAlbums.filter(a => a.id !== album.id)

  function handlePlayAlbum() {
    if (isAlbumPlaying) togglePlay()
    else if (albumTracks.length > 0) playTrack(albumTracks[0], albumTracks)
  }

  const typeLabel = album.type === 'ep' ? 'EP' : album.type === 'single' ? 'Сингл' : 'Альбом'

  return (
    <div className="animate-fade-in-up">
      <div
        className="relative px-8 pt-8 pb-7"
        style={{ background: `linear-gradient(160deg, ${album.color}30, ${album.color}10, transparent 65%)` }}
      >
        <div className="flex items-end gap-6">
          <Cover
            src={album.cover_url}
            color={album.color}
            className="w-44 h-44 flex-shrink-0 shadow-2xl"
            rounded="md"
            alt={album.title}
          />
          <div className="flex-1 min-w-0 pb-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">{typeLabel}</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2 truncate">
              {album.title}
            </h1>
            <button
              onClick={() => navigate(`/artist/${album.artist_id}`)}
              className="text-sm font-semibold text-text-primary hover:text-white transition-colors"
            >
              {album.artist.name}
            </button>
            <p className="text-xs text-text-secondary mt-1">
              {album.year} · {albumTracks.length} треков
              {totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handlePlayAlbum}
            disabled={albumTracks.length === 0}
            className="w-11 h-11 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            {isAlbumPlaying
              ? <Pause className="w-5 h-5 text-white fill-white" />
              : <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            }
          </button>
        </div>
      </div>

      <div className="px-8 pb-6">
        <div className="flex items-center gap-3 px-3 pb-2 border-b border-border mb-1">
          <div className="w-6 text-center text-xs text-text-muted">#</div>
          <div className="flex-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Название</div>
          <div className="hidden lg:block text-xs font-semibold text-text-muted uppercase tracking-wider w-14 text-right">Слушали</div>
          <div className="w-8" />
          <div className="w-8 text-right flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-text-muted ml-auto" />
          </div>
          <div className="w-8" />
        </div>
        <div className="space-y-0.5">
          {albumTracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} queue={albumTracks} showPlays />
          ))}
        </div>
      </div>

      {relatedAlbums.length > 0 && (
        <div className="px-8 pb-8">
          <SectionHeader title={`Ещё от ${album.artist.name}`} />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {relatedAlbums.map(a => (
              <div key={a.id} className="flex-shrink-0">
                <AlbumCard album={a} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
