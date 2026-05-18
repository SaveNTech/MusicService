import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, Plus, Trash2 } from 'lucide-react'
import { adminApi, artistsApi, albumsApi, tracksApi } from '@/api'

type Tab = 'track' | 'artist' | 'album'

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('track')

  return (
    <div className="px-8 py-6 max-w-2xl animate-fade-in-up">
      <h1 className="text-xl font-bold text-text-primary mb-6">Панель администратора</h1>

      <div className="flex gap-1 mb-6 bg-bg-card border border-border rounded-lg p-1 w-fit">
        {([['track', 'Трек'], ['artist', 'Артист'], ['album', 'Альбом']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === key ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'artist' && <ArtistForm />}
      {tab === 'album' && <AlbumForm />}
      {tab === 'track' && <TrackForm />}
    </div>
  )
}

function ArtistForm() {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [listeners, setListeners] = useState('')
  const [verified, setVerified] = useState(false)
  const [cover, setCover] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('bio', bio)
      fd.append('monthly_listeners', listeners || '0')
      fd.append('verified', String(verified))
      if (cover) fd.append('cover', cover)
      await adminApi.createArtist(fd)
      qc.invalidateQueries({ queryKey: ['artists'] })
      setName(''); setBio(''); setListeners(''); setVerified(false); setCover(null)
      setMsg('Артист создан!')
    } catch {
      setMsg('Ошибка при создании артиста')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить артиста?')) return
    await adminApi.deleteArtist(id)
    qc.invalidateQueries({ queryKey: ['artists'] })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Создать артиста</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-sm">Имя</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="input-base w-full mt-1" />
          </div>
          <div>
            <label className="label-sm">Слушателей в месяц</label>
            <input type="number" value={listeners} onChange={e => setListeners(e.target.value)} className="input-base w-full mt-1" />
          </div>
        </div>
        <div>
          <label className="label-sm">Биография</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="input-base w-full mt-1 resize-none" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} className="accent-accent" />
            Верифицирован
          </label>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            {cover ? cover.name : 'Обложка'}
            <input type="file" accept="image/*" className="hidden" onChange={e => setCover(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {msg && <p className={`text-xs ${msg.includes('!') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" /> {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>

      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Артисты ({artists.length})</h2>
        <div className="space-y-1.5">
          {artists.map(a => (
            <div key={a.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white/[0.03]">
              <span className="text-sm text-text-primary">{a.name}</span>
              <button onClick={() => handleDelete(a.id)} className="p-1 text-text-muted hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {artists.length === 0 && <p className="text-xs text-text-muted">Нет артистов</p>}
        </div>
      </div>
    </div>
  )
}

function AlbumForm() {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [artistId, setArtistId] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [type, setType] = useState('album')
  const [cover, setCover] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
  })
  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.list().then(r => r.data),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('artist_id', artistId)
      fd.append('year', year)
      fd.append('type', type)
      if (cover) fd.append('cover', cover)
      await adminApi.createAlbum(fd)
      qc.invalidateQueries({ queryKey: ['albums'] })
      setTitle(''); setArtistId(''); setYear(String(new Date().getFullYear())); setType('album'); setCover(null)
      setMsg('Альбом создан!')
    } catch {
      setMsg('Ошибка при создании альбома')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить альбом?')) return
    await adminApi.deleteAlbum(id)
    qc.invalidateQueries({ queryKey: ['albums'] })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Создать альбом</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-sm">Название</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className="input-base w-full mt-1" />
          </div>
          <div>
            <label className="label-sm">Год</label>
            <input type="number" value={year} onChange={e => setYear(e.target.value)} required className="input-base w-full mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-sm">Артист</label>
            <select value={artistId} onChange={e => setArtistId(e.target.value)} required className="input-base w-full mt-1">
              <option value="">Выберите...</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sm">Тип</label>
            <select value={type} onChange={e => setType(e.target.value)} className="input-base w-full mt-1">
              <option value="album">Альбом</option>
              <option value="ep">EP</option>
              <option value="single">Сингл</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer w-fit">
          <Upload className="w-3.5 h-3.5" />
          {cover ? cover.name : 'Обложка'}
          <input type="file" accept="image/*" className="hidden" onChange={e => setCover(e.target.files?.[0] ?? null)} />
        </label>
        {msg && <p className={`text-xs ${msg.includes('!') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Plus className="w-3.5 h-3.5" /> {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>

      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Альбомы ({albums.length})</h2>
        <div className="space-y-1.5">
          {albums.map(a => (
            <div key={a.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white/[0.03]">
              <div>
                <span className="text-sm text-text-primary">{a.title}</span>
                <span className="text-xs text-text-muted ml-2">{a.artist.name} · {a.year}</span>
              </div>
              <button onClick={() => handleDelete(a.id)} className="p-1 text-text-muted hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {albums.length === 0 && <p className="text-xs text-text-muted">Нет альбомов</p>}
        </div>
      </div>
    </div>
  )
}

function TrackForm() {
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [artistId, setArtistId] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [audio, setAudio] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const { data: artists = [] } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsApi.list().then(r => r.data),
  })
  const { data: albums = [] } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.list().then(r => r.data),
  })
  const { data: tracks = [] } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => tracksApi.list().then(r => r.data),
  })

  const filteredAlbums = artistId ? albums.filter(a => String(a.artist_id) === artistId) : albums

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!audio) { setMsg('Выберите аудиофайл'); return }
    setLoading(true); setMsg('')
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('artist_id', artistId)
      fd.append('album_id', albumId)
      fd.append('audio', audio)
      if (cover) fd.append('cover', cover)
      await adminApi.uploadTrack(fd)
      qc.invalidateQueries({ queryKey: ['tracks'] })
      setTitle(''); setArtistId(''); setAlbumId(''); setAudio(null); setCover(null)
      setMsg('Трек загружен!')
    } catch {
      setMsg('Ошибка при загрузке трека')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить трек?')) return
    await adminApi.deleteTrack(id)
    qc.invalidateQueries({ queryKey: ['tracks'] })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Загрузить трек</h2>
        <div>
          <label className="label-sm">Название</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required className="input-base w-full mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-sm">Артист</label>
            <select value={artistId} onChange={e => { setArtistId(e.target.value); setAlbumId('') }} required className="input-base w-full mt-1">
              <option value="">Выберите...</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sm">Альбом</label>
            <select value={albumId} onChange={e => setAlbumId(e.target.value)} required className="input-base w-full mt-1">
              <option value="">Выберите...</option>
              {filteredAlbums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <label className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-md border transition-colors ${audio ? 'border-accent text-accent-light' : 'border-border text-text-secondary hover:border-white/20'}`}>
            <Upload className="w-3.5 h-3.5" />
            {audio ? audio.name : 'Аудиофайл *'}
            <input type="file" accept="audio/*" className="hidden" onChange={e => setAudio(e.target.files?.[0] ?? null)} />
          </label>
          <label className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-md border transition-colors ${cover ? 'border-accent text-accent-light' : 'border-border text-text-secondary hover:border-white/20'}`}>
            <Upload className="w-3.5 h-3.5" />
            {cover ? cover.name : 'Обложка (опц.)'}
            <input type="file" accept="image/*" className="hidden" onChange={e => setCover(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {msg && <p className={`text-xs ${msg.includes('!') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Upload className="w-3.5 h-3.5" /> {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </form>

      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Треки ({tracks.length})</h2>
        <div className="space-y-1.5">
          {tracks.map(t => (
            <div key={t.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white/[0.03]">
              <div>
                <span className="text-sm text-text-primary">{t.title}</span>
                <span className="text-xs text-text-muted ml-2">{t.artist.name}</span>
              </div>
              <button onClick={() => handleDelete(t.id)} className="p-1 text-text-muted hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {tracks.length === 0 && <p className="text-xs text-text-muted">Нет треков</p>}
        </div>
      </div>
    </div>
  )
}
