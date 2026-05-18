import { useParams } from 'react-router-dom'
import { Play, Pause, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Cover } from '@/components/ui/Cover'
import { TrackRow } from '@/components/ui/TrackRow'
import { usePlayerStore } from '@/store/playerStore'
import { playlistsApi } from '@/api'
import { formatDuration } from '@/utils'

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const playTrack = usePlayerStore(s => s.playTrack)
  const currentTrack = usePlayerStore(s => s.currentTrack)
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const togglePlay = usePlayerStore(s => s.togglePlay)

  const playlistId = parseInt(id ?? '0')

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => playlistsApi.get(playlistId).then(r => r.data),
    enabled: !!playlistId,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!playlist) return (
    <div className="flex items-center justify-center h-48 text-text-secondary">Плейлист не найден</div>
  )

  const tracks = playlist.tracks ?? []
  const isListPlaying = tracks.some(t => t.id === currentTrack?.id) && isPlaying
  const totalDuration = tracks.reduce((s, t) => s + t.duration, 0)

  function handlePlay() {
    if (isListPlaying) togglePlay()
    else if (tracks.length > 0) playTrack(tracks[0], tracks)
  }

  return (
    <div className="animate-fade-in-up">
      <div
        className="relative px-8 pt-8 pb-7"
        style={{ background: `linear-gradient(160deg, ${playlist.color}30, ${playlist.color}10, transparent 65%)` }}
      >
        <div className="flex items-end gap-6">
          <Cover
            src={playlist.cover_url}
            color={playlist.color}
            className="w-44 h-44 flex-shrink-0 shadow-2xl"
            rounded="md"
            alt={playlist.title}
          />
          <div className="flex-1 min-w-0 pb-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">Плейлист</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2">
              {playlist.title}
            </h1>
            {playlist.description && (
              <p className="text-sm text-text-secondary">{playlist.description}</p>
            )}
            <p className="text-xs text-text-muted mt-1.5">
              {tracks.length} треков{totalDuration > 0 && ` · ${formatDuration(totalDuration)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handlePlay}
            disabled={tracks.length === 0}
            className="w-11 h-11 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            {isListPlaying
              ? <Pause className="w-5 h-5 text-white fill-white" />
              : <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            }
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        {tracks.length > 0 ? (
          <>
            <div className="flex items-center gap-3 px-3 pb-2 border-b border-border mb-1">
              <div className="w-6 text-center text-xs text-text-muted">#</div>
              <div className="flex-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Название</div>
              <div className="w-8" />
              <div className="w-8 text-right flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-text-muted ml-auto" />
              </div>
              <div className="w-8" />
            </div>
            <div className="space-y-0.5">
              {tracks.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={tracks} showCover />
              ))}
            </div>
          </>
        ) : (
          <p className="text-text-muted text-sm text-center py-10">Плейлист пуст</p>
        )}
      </div>
    </div>
  )
}
