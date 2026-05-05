import { clsx } from 'clsx'

interface GradientCoverProps {
  gradient: [string, string]
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
  children?: React.ReactNode
}

const sizeMap = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
}

const roundedMap = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

export function GradientCover({ gradient, size = 'md', rounded = 'md', className, children }: GradientCoverProps) {
  return (
    <div
      className={clsx('flex-shrink-0 flex items-center justify-center overflow-hidden', sizeMap[size], roundedMap[rounded], className)}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
    >
      {children}
    </div>
  )
}
