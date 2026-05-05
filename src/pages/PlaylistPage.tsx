import { useParams } from 'react-router-dom'
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react'
import { GradientCover } from '@/components/ui/GradientCover'
import { TrackRow } from '@/components/ui/TrackRow'
import { usePlayerStore } from '@/store/playerStore'
import { getPlaylistById, getTrackById, formatDuration } from '@/data/mockData'

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const playlist = id ? getPlaylistById(id) : null
  if (!playlist) return (
    <div className="flex items-center justify-center h-full text-text-secondary">
      Плейлист не найден
    </div>
  )

  const playlistTracks = playlist.trackIds
    .map(id => getTrackById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTrackById>>[]

  const isListPlaying = playlistTracks.some(t => t.id === currentTrack?.id) && isPlaying
  const totalDuration = playlistTracks.reduce((s, t) => s + t.duration, 0)

  function handlePlay() {
    if (isListPlaying) {
      togglePlay()
    } else if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div
        className="relative px-8 pt-10 pb-8"
        style={{ background: `linear-gradient(160deg, ${playlist.gradient[0]}33, ${playlist.gradient[1]}22, transparent 60%)` }}
      >
        <div className="flex items-end gap-7">
          <div className="flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden w-48 h-48"
            style={{ boxShadow: `0 24px 60px ${playlist.gradient[0]}50` }}>
            <GradientCover gradient={playlist.gradient} className="w-full h-full" rounded="lg" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">Плейлист</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2">{playlist.title}</h1>
            <p className="text-base text-text-secondary">{playlist.description}</p>
            <p className="text-sm text-text-muted mt-2">
              {playlist.createdBy} · {playlistTracks.length} треков · {formatDuration(totalDuration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handlePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 glow-accent"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            {isListPlaying
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
      <div className="px-8 pb-8">
        <div className="flex items-center gap-3 px-3 pb-3 border-b border-white/5 mb-2">
          <div className="w-6 text-center text-xs text-text-muted">#</div>
          <div className="flex-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Название</div>
          <div className="hidden md:block text-xs font-semibold text-text-muted uppercase tracking-wider w-32 text-right">Альбом</div>
          <div className="w-8" />
          <div className="w-8 text-right flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-text-muted ml-auto" />
          </div>
          <div className="w-8" />
        </div>

        <div className="space-y-0.5">
          {playlistTracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i} queue={playlistTracks} showAlbum />
          ))}
        </div>
      </div>
    </div>
  )
}
