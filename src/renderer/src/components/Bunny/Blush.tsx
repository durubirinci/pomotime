import { motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import type { BunnyMood } from './types'

interface BlushProps {
  mood: BunnyMood
}

/** Rosy cheeks. Always there; they glow deeper when a session is finished. */
export function Blush({ mood }: BlushProps): React.JSX.Element {
  const glowing = mood === 'celebrate'
  const cosy = mood === 'snack' || mood === 'tea'
  const animate = {
    fill: glowing ? '#ff5c8d' : cosy ? '#ffa0ba' : '#ffb3c7',
    opacity: glowing ? 1 : 0.85,
    scale: glowing ? 1.35 : cosy ? 1.12 : 1
  }
  return (
    <g>
      {[66, 134].map((cx) => (
        <motion.ellipse
          key={cx}
          cx={cx}
          cy={125}
          rx={9}
          ry={5.5}
          initial={false}
          animate={animate}
          transition={SPRING_BOUNCY}
        />
      ))}
    </g>
  )
}
