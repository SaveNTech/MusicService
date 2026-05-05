import { ChevronLeft, ChevronRight, Bell, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function TopBar() {
  const navigate = useNavigate()

  return (
    <header className="h-16 flex-shrink-0 flex items-center gap-4 px-6 glass-strong border-b border-white/5 z-10">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white">
          <Bell className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-text-secondary hover:text-white">
          <Settings className="w-4 h-4" />
        </button>

        <button
          className="ml-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)' }}
        >
          Premium
        </button>
      </div>
    </header>
  )
}
