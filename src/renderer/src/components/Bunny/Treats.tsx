import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { FUR, OUTLINE, type BunnyMood } from './types'

function Carrot(): React.JSX.Element {
  return (
    // Nibbled from the tip, which sits right at the mouth.
    <motion.g
      animate={{ x: [0, -1.2, 0], y: [0, -1.2, 0] }}
      transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
    >
      <g transform="translate(101 138) rotate(-38)">
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
    <g>
      {/* Steam curling upward. */}
      {[93, 107].map((x, index) => (
        <motion.path
          key={x}
          d={`M${x} 152 q-2.5 -2.75 0 -5.5 q2.5 -2.75 0 -5.5`}
          fill="none"
          stroke="#b9a2f0"
          strokeWidth={2.2}
          strokeLinecap="round"
          animate={{ y: [3, -5], opacity: [0, 0.85, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.9, ease: 'easeOut' }}
        />
      ))}
      <path
        d="M116 161 q10 0 9 7 q-1 6 -11 6"
        fill="none"
        stroke="#b9a2f0"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d="M83 156 H117 Q117 177 100 177 Q83 177 83 156Z"
        fill="#d9ccfa"
        stroke="#b9a2f0"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <ellipse
        cx={100}
        cy={156.5}
        rx={17}
        ry={3.4}
        fill="#c98a5a"
        stroke="#b9a2f0"
        strokeWidth={2}
      />
      <path
        d="M100 170.5 C95.6 167.4 97.2 163.6 100 166.1 C102.8 163.6 104.4 167.4 100 170.5Z"
        fill="#fff"
        opacity={0.85}
      />
    </g>
  )
}

/** Where each paw rests for a given mood. */
const PAWS: Record<BunnyMood, [left: [number, number], right: [number, number]]> = {
  idle: [
    [87, 160],
    [113, 160]
  ],
  focus: [
    [87, 160],
    [113, 160]
  ],
  paused: [
    [87, 160],
    [113, 160]
  ],
  celebrate: [
    [64, 150],
    [136, 150]
  ],
  snack: [
    [105, 156],
    [120, 159]
  ],
  tea: [
    [82, 168],
    [119, 171]
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
          rx={8}
          ry={6.2}
          fill={FUR}
          stroke={OUTLINE}
          strokeWidth={2.3}
          initial={false}
          animate={{ cx, cy }}
          transition={SPRING_BOUNCY}
        />
      ))}
    </g>
  )
}
