import { clsx } from 'clsx'

interface TrackCoverProps {
  coverSrc?: string
  gradient: [string, string]
  className?: string
  alt?: string
}

export function TrackCover({ coverSrc, gradient, className, alt = '' }: TrackCoverProps) {
  if (coverSrc) {
    return (
      <div className={clsx('overflow-hidden flex-shrink-0', className)}>
        <img src={coverSrc} alt={alt} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={clsx('flex-shrink-0', className)}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
    />
  )
}
