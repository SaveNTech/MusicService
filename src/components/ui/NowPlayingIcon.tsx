interface NowPlayingIconProps {
  isPlaying?: boolean
  size?: number
}

export function NowPlayingIcon({ isPlaying = true, size = 16 }: NowPlayingIconProps) {
  if (!isPlaying) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M3 2.5L13 8L3 13.5V2.5Z" fill="#a78bfa" />
      </svg>
    )
  }

  return (
    <span
      className="inline-flex items-end gap-[2px]"
      style={{ height: size, width: size * 0.9 }}
    >
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
    </span>
  )
}
