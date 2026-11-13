import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { INK, type BunnyMood } from './types'

const stroke = {
  fill: 'none',
  stroke: INK,
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const

function shape(mood: BunnyMood): React.JSX.Element {
  switch (mood) {
    case 'focus':
      // A small, serious line.
      return <path d="M96 135 Q100 136.2 104 135" {...stroke} />
    case 'paused':
      // A tiny "o?"
      return <ellipse cx={100} cy={136} rx={2.8} ry={3.4} fill="#d9728f" />
    case 'celebrate':
      // Wide open and delighted.
      return (
        <path
          d="M92 132 Q100 148 108 132Z"
          fill="#e8688f"
          stroke={INK}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      )
    case 'snack':
      // Chewing.
      return (
        <motion.path
          d="M94 132 Q97 136.5 100 132 Q103 136.5 106 132"
          {...stroke}
          animate={{ scaleY: [1, 0.45, 1], scaleX: [1, 1.12, 1] }}
          transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
        />
      )
    case 'tea':
      return <path d="M95 133 Q100 138 105 133" {...stroke} />
    default:
      // The classic bunny "w".
      return <path d="M92.5 132 Q96.25 137.5 100 132 Q103.75 137.5 107.5 132" {...stroke} />
  }
}

export function Mouth({ mood }: { mood: BunnyMood }): React.JSX.Element {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.g
        key={mood}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.06 } }}
        transition={SPRING_BOUNCY}
      >
        {shape(mood)}
      </motion.g>
    </AnimatePresence>
  )
}
