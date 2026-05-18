import { clsx } from 'clsx'

interface CoverProps {
  src?: string | null
  color: string
  className?: string
  alt?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedMap = { sm: 'rounded', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }

export function Cover({ src, color, className, alt = '', rounded = 'md' }: CoverProps) {
  const base = clsx('flex-shrink-0 overflow-hidden', roundedMap[rounded], className)

  if (src) {
    return (
      <div className={base}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={base}
      style={{ background: `linear-gradient(135deg, ${color}dd, ${color}66)` }}
    />
  )
}
