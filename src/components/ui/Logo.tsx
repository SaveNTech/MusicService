interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  sm: { box: 'w-6 h-6 rounded-md', text: 'text-sm tracking-[0.2em]' },
  md: { box: 'w-8 h-8 rounded-lg', text: 'text-base tracking-[0.2em]' },
  lg: { box: 'w-10 h-10 rounded-xl', text: 'text-xl tracking-[0.2em]' },
}

export function Logo({ size = 'md' }: LogoProps) {
  const { box, text } = config[size]

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} bg-accent flex items-center justify-center flex-shrink-0`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-[70%] h-[70%]">
          {/* Audio waveform — 5 bars, peak in center */}
          <rect x="0"    y="8"  width="3" height="8"  rx="1.5" fill="white" opacity="0.7"/>
          <rect x="5.25" y="5"  width="3" height="14" rx="1.5" fill="white" opacity="0.85"/>
          <rect x="10.5" y="2"  width="3" height="20" rx="1.5" fill="white"/>
          <rect x="15.75" y="6" width="3" height="12" rx="1.5" fill="white" opacity="0.85"/>
          <rect x="21"   y="9"  width="3" height="7"  rx="1.5" fill="white" opacity="0.7"/>
        </svg>
      </div>
      <span className={`font-bold text-text-primary ${text}`}>AURA</span>
    </div>
  )
}