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
    fill: glowing ? '#ff5c8d' : cosy ? '#ff9fba' : '#ffaec4',
    opacity: glowing ? 1 : 0.9,
    scale: glowing ? 1.3 : cosy ? 1.1 : 1
  }
  return (
    <g>
      {[62, 138].map((cx) => (
        <motion.g key={cx} initial={false} animate={animate} transition={SPRING_BOUNCY}>
          <ellipse cx={cx} cy={133} rx={10} ry={6.2} />
          {/* A tiny shine so the cheek looks round. */}
          <ellipse cx={cx - 3} cy={131} rx={3} ry={1.5} fill="#fff" opacity={0.55} />
        </motion.g>
      ))}
    </g>
  )
}
