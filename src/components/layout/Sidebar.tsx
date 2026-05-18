import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, Library, Heart, Plus, LogOut, Shield } from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { Cover } from '@/components/ui/Cover'
import { Logo } from '@/components/ui/Logo'
import { playlistsApi } from '@/api'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/search', icon: Search, label: 'Поиск' },
  { to: '/library', icon: Library, label: 'Библиотека' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: () => playlistsApi.list().then(r => r.data),
  })

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.username?.slice(0, 1).toUpperCase() ?? '?'

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col h-full bg-bg-surface border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-0.5">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/15 text-accent-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive && 'text-accent')} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/15 text-accent-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Shield className={clsx('w-4 h-4 flex-shrink-0', isActive && 'text-accent')} />
                Админ
              </>
            )}
          </NavLink>
        )}
      </nav>

      <div className="mx-4 my-3 border-t border-border" />

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Плейлисты</span>
          <button className="w-5 h-5 rounded bg-white/[0.05] hover:bg-white/10 flex items-center justify-center transition-colors">
            <Plus className="w-3 h-3 text-text-secondary" />
          </button>
        </div>

        <NavLink
          to="/library?tab=favorites"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              isActive ? 'bg-accent/10' : 'hover:bg-white/[0.04]',
            )
          }
        >
          <div className="w-8 h-8 rounded-md bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Любимые</p>
            <p className="text-[11px] text-text-muted">Плейлист</p>
          </div>
        </NavLink>

        {playlists.map((pl) => (
          <NavLink
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive ? 'bg-accent/10' : 'hover:bg-white/[0.04]',
              )
            }
          >
            <Cover
              src={pl.cover_url}
              color={pl.color}
              className="w-8 h-8 flex-shrink-0"
              rounded="sm"
              alt={pl.title}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">{pl.title}</p>
              <p className="text-[11px] text-text-muted">{pl.track_count ?? 0} треков</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* User area */}
      <div className="px-3 py-3 border-t border-border">
        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">{user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
              title="Выйти"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors text-left"
          >
            Войти
          </button>
        )}
      </div>
    </aside>
  )
}
