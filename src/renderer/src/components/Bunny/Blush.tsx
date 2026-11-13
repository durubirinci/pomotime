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
    fill: glowing ? '#ff7fa3' : cosy ? '#ffa0ba' : '#ffb3c7',
    opacity: 1,
    scale: glowing || cosy ? 1.1 : 1
  }
  return (
    <g>
      {[63, 137].map((cx) => (
        <motion.ellipse
          key={cx}
          cx={cx}
          cy={134}
          rx={9.5}
          ry={6}
          initial={false}
          animate={animate}
          transition={SPRING_BOUNCY}
        />
      ))}
    </g>
  )
}
