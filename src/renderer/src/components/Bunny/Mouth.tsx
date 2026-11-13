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
      return <path d="M96 129.5 Q100 130.6 104 129.5" {...stroke} />
    case 'paused':
      // A tiny "o?"
      return <ellipse cx={100} cy={130.5} rx={2.6} ry={3.2} fill="#d9728f" />
    case 'celebrate':
      // Wide open and delighted.
      return (
        <path
          d="M92.5 126 Q100 141 107.5 126Z"
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
          d="M94 126.5 Q97 131 100 126.5 Q103 131 106 126.5"
          {...stroke}
          animate={{ scaleY: [1, 0.45, 1], scaleX: [1, 1.12, 1] }}
          transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
        />
      )
    case 'tea':
      return <path d="M95 127.5 Q100 132.5 105 127.5" {...stroke} />
    default:
      // The classic bunny "w".
      return <path d="M93 126.5 Q96.5 131.5 100 126.5 Q103.5 131.5 107 126.5" {...stroke} />
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
