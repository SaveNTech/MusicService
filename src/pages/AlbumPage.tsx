import { useParams, useNavigate } from 'react-router-dom'
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react'
import { TrackCover } from '@/components/ui/TrackCover'
import { TrackRow } from '@/components/ui/TrackRow'
import { AlbumCard } from '@/components/ui/AlbumCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePlayerStore } from '@/store/playerStore'
import {
  getAlbumById, getAlbumTracks, getArtistById,
  getArtistAlbums, formatDuration,
} from '@/data/mockData'

export function AlbumPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const album = id ? getAlbumById(id) : null
  if (!album) return (
    <div className="flex items-center justify-center h-full text-text-secondary">Альбом не найден</div>
  )

  const albumTracks = getAlbumTracks(album.id)
  const artist = getArtistById(album.artistId)
  const isAlbumPlaying = albumTracks.some(t => t.id === currentTrack?.id) && isPlaying
  const totalDuration = albumTracks.reduce((s, t) => s + t.duration, 0)
  const relatedAlbums = artist ? getArtistAlbums(artist.id).filter(a => a.id !== album.id) : []
  const firstCover = albumTracks.find(t => t.coverSrc)?.coverSrc

  function handlePlayAlbum() {
    if (isAlbumPlaying) togglePlay()
    else if (albumTracks.length > 0) playTrack(albumTracks[0], albumTracks)
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div
        className="relative px-8 pt-10 pb-8"
        style={{ background: `linear-gradient(160deg, ${album.gradient[0]}33, ${album.gradient[1]}22, transparent 60%)` }}
      >
        <div className="flex items-end gap-7">
          <div
            className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: `0 24px 60px ${album.gradient[0]}50` }}
          >
            <TrackCover
              coverSrc={firstCover}
              gradient={album.gradient}
              className="w-full h-full"
              alt={album.title}
            />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">
              {album.type === 'ep' ? 'EP' : album.type === 'single' ? 'Сингл' : 'Альбом'}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 truncate">
              {album.title}
            </h1>
            <button
              onClick={() => navigate(`/artist/${album.artistId}`)}
              className="text-base font-semibold text-text-primary hover:text-white transition-colors"
            >
              {artist?.name}
            </button>
            <p className="text-sm text-text-secondary mt-1">
              {album.year} · {albumTracks.length} {albumTracks.length === 1 ? 'трек' : 'треков'}
              {totalDuration > 0 ? ` · ${formatDuration(totalDuration)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handlePlayAlbum}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 glow-accent"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            {isAlbumPlaying
              ? <Pause className="w-6 h-6 text-white fill-white" />
              : <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            }
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-text-secondary hover:text-white hover:border-white/40 transition-all">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-text-secondary hover:text-white hover:border-white/40 transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="px-8 pb-6">
        <div className="flex items-center gap-3 px-3 pb-3 border-b border-white/5 mb-2">
          <div className="w-6 text-center text-xs text-text-muted">#</div>
          <div className="flex-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Название</div>
          <div className="hidden lg:block text-xs font-semibold text-text-muted uppercase tracking-wider w-16 text-right">Слушали</div>
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
          <SectionHeader title={`Ещё от ${artist?.name}`} />
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
