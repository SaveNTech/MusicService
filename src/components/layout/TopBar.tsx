import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function TopBar() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <header className="h-14 flex-shrink-0 flex items-center gap-4 px-6 bg-bg-surface border-b border-border">
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-accent hover:bg-accent/90 text-white transition-colors"
          >
            Войти
          </button>
        )}
      </div>
    </header>
  )
}
