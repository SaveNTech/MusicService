import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SectionHeader({ title, href }: { title: string; href?: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {href && (
        <button
          onClick={() => navigate(href)}
          className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group"
        >
          Все <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  )
}
