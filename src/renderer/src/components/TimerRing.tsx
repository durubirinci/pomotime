import type { ReactNode } from 'react'

const RADIUS = 92
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface TimerRingProps {
  /** 0 to 1. */
  progress: number
  /** Skip the easing when the ring jumps back to empty. */
  animated: boolean
  strokeWidth?: number
  className?: string
  children: ReactNode
}

/** Circular progress ring that fills up around whatever is inside it. */
export function TimerRing({
  progress,
  animated,
  strokeWidth = 8,
  className = '',
  children
}: TimerRingProps): React.JSX.Element {
  const clamped = Math.min(1, Math.max(0, progress))
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle
          cx={100}
          cy={100}
          r={RADIUS - strokeWidth / 2 - 1}
          className="fill-(--soft) transition-[fill] duration-700"
        />
        <circle
          cx={100}
          cy={100}
          r={RADIUS}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.75}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={100}
          cy={100}
          r={RADIUS}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
          className="stroke-(--accent)"
          style={{
            transition: `stroke 700ms${animated ? ', stroke-dashoffset 120ms linear' : ''}`,
            opacity: clamped > 0 ? 1 : 0
          }}
        />
      </svg>
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
