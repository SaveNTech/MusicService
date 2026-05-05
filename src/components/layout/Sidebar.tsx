import { NavLink } from 'react-router-dom'
import { Home, Search, Library, Heart, Plus, Radio } from 'lucide-react'
import { clsx } from 'clsx'
import { GradientCover } from '@/components/ui/GradientCover'
import { playlists } from '@/data/mockData'

const navLinks = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/search', icon: Search, label: 'Поиск' },
  { to: '/library', icon: Library, label: 'Библиотека' },
]

export function Sidebar() {
  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col h-full glass-strong border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)' }}
        >
          <Radio className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold gradient-text tracking-tight">AURA</span>
      </div>

      {/* Main navigation */}
      <nav className="px-3 space-y-1">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent/20 text-accent-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4', isActive && 'text-accent-light')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-white/5" />

      {/* Playlists section */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-3 mb-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Плейлисты</span>
          <button className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <Plus className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>

        {/* Liked songs */}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)' }}>
            <Heart className="w-4 h-4 text-accent-light fill-accent-light" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-medium text-text-primary truncate">Любимые</p>
            <p className="text-xs text-text-muted">Плейлист</p>
          </div>
        </button>

        {/* User playlists */}
        {playlists.map((pl) => (
          <NavLink
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className={({ isActive }) =>
              clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive ? 'bg-accent/10' : 'hover:bg-white/5',
              )
            }
          >
            <GradientCover gradient={pl.gradient} size="xs" rounded="sm" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium text-text-primary truncate">{pl.title}</p>
              <p className="text-xs text-text-muted">{pl.trackIds.length} треков</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Bottom user area */}
      <div className="px-4 py-4 border-t border-white/5">
        <button className="flex items-center gap-3 w-full rounded-lg hover:bg-white/5 p-2 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            A
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-medium text-text-primary">Nikita</p>
            <p className="text-xs text-text-muted">Бесплатный план</p>
          </div>
        </button>
      </div>
    </aside>
  )
}
