import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { INK, type BunnyMood } from './types'

const stroke = {
  fill: 'none',
  stroke: INK,
  strokeWidth: 2.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const

function shape(mood: BunnyMood): React.JSX.Element {
  switch (mood) {
    case 'focus':
      // A small smile with the tip of the tongue poking out.
      return (
        <>
          <ellipse
            cx={102.9}
            cy={137}
            rx={2.5}
            ry={2.6}
            fill="#ff9dba"
            stroke={INK}
            strokeWidth={1.6}
          />
          <path d="M95.5 134 Q100 137.6 104.5 134" {...stroke} />
        </>
      )
    case 'paused':
      // A tiny "o?"
      return <ellipse cx={100} cy={136} rx={2.6} ry={3.2} fill="#d9728f" />
    case 'celebrate':
      // Wide open and delighted.
      return (
        <path
          d="M92.5 133.5 Q100 148 107.5 133.5Z"
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
          d="M94 133.5 Q97 137.5 100 133.5 Q103 137.5 106 133.5"
          {...stroke}
          animate={{ scaleY: [1, 0.45, 1], scaleX: [1, 1.12, 1] }}
          transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
        />
      )
    case 'tea':
      return <path d="M96 132.5 Q100 136 104 132.5" {...stroke} />
    default:
      // The classic bunny "w".
      return <path d="M94 133.5 Q97 137.5 100 133.5 Q103 137.5 106 133.5" {...stroke} />
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
