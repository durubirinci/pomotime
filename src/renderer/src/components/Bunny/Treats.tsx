import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { furStroke, type BunnyMood } from './types'

function Carrot(): React.JSX.Element {
  return (
    // Nibbled from the tip, which sits right at the mouth.
    <motion.g
      animate={{ x: [0, -1.2, 0], y: [0, -1.2, 0] }}
      transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
    >
      <g transform="translate(101 138) rotate(-20) scale(1.2)">
        <path d="M-3 26 Q-9 34 -5 38 Q-2 34 0 28 Q1 36 5 38 Q8 33 3 26Z" fill="#7fcf8f" />
        <path
          d="M0 0 Q3 1 4 5 L7.5 24 Q7 29 0 29 Q-7 29 -7.5 24 L-4 5 Q-3 1 0 0Z"
          fill="#ffa24a"
          stroke="#f08a30"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M-3 12 h4 M0 19 h4.5"
          stroke="#f08a30"
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </motion.g>
  )
}

function TeaCup(): React.JSX.Element {
  return (
    <g transform="translate(0 6)">
      {/* Steam curling upward. */}
      {[93, 106].map((x, index) => (
        <motion.path
          key={x}
          d={`M${x} 138 q-4 -5 0 -9 q4 -4 0 -9`}
          fill="none"
          stroke="#fff"
          strokeWidth={2.4}
          strokeLinecap="round"
          animate={{ y: [3, -6], opacity: [0, 0.95, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.9, ease: 'easeOut' }}
        />
      ))}
      <path
        d="M116 147 q10 0 9 7 q-1 6 -11 6"
        fill="none"
        stroke="#b9a2f0"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d="M82 142 H118 Q118 164 100 164 Q82 164 82 142Z"
        fill="#d9ccfa"
        stroke="#b9a2f0"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <ellipse
        cx={100}
        cy={142.5}
        rx={17}
        ry={3.4}
        fill="#c98a5a"
        stroke="#b9a2f0"
        strokeWidth={2}
      />
      <path d="M100 150 l2.2 3.4 l-2.2 3.4 l-2.2 -3.4Z" fill="#fff" opacity={0.8} />
    </g>
  )
}

/** Where each paw rests for a given mood. */
const PAWS: Record<BunnyMood, [left: [number, number], right: [number, number]]> = {
  idle: [
    [88, 165],
    [112, 165]
  ],
  focus: [
    [89, 163],
    [111, 163]
  ],
  paused: [
    [88, 165],
    [112, 165]
  ],
  celebrate: [
    [66, 150],
    [134, 150]
  ],
  snack: [
    [98, 162],
    [119, 158]
  ],
  tea: [
    [81, 159],
    [117, 163]
  ]
}

/** The break-time snack plus the paws that hold it. */
export function Treats({ mood }: { mood: BunnyMood }): React.JSX.Element {
  const [left, right] = PAWS[mood]
  return (
    <g>
      <AnimatePresence initial={false}>
        {(mood === 'snack' || mood === 'tea') && (
          <motion.g
            key={mood}
            initial={{ scale: 0, y: 26, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 26, opacity: 0, transition: { duration: 0.15 } }}
            transition={SPRING_BOUNCY}
          >
            {mood === 'snack' ? <Carrot /> : <TeaCup />}
          </motion.g>
        )}
      </AnimatePresence>
      {[left, right].map(([cx, cy], index) => (
        <motion.ellipse
          key={index}
          rx={7.8}
          ry={6.4}
          {...furStroke}
          strokeWidth={2.3}
          initial={false}
          animate={{ cx, cy }}
          transition={SPRING_BOUNCY}
        />
      ))}
    </g>
  )
}
