import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRandomPulse } from '@renderer/hooks/useRandomPulse'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { Blush } from './Blush'
import { Ears } from './Ears'
import { Eyes } from './Eyes'
import { Mouth } from './Mouth'
import { Nose } from './Nose'
import { Treats } from './Treats'
import { FUR, INK, OUTLINE, type BunnyMood } from './types'

export type { BunnyMood } from './types'

const HOP_MS = 300

/** Chubby head: widest below the middle, so the cheeks look full. */
const HEAD =
  'M100 68 C134 68 156 90 156 118 C156 146 132 158 100 158 C68 158 44 146 44 118 C44 90 66 68 100 68Z'
/** A little puff of fur between the ears. */
const TUFT = 'M90.5 72 Q91 62.5 96 66 Q98.5 57 103 64.5 Q108 60 109.5 72'
/** Fluffy body: an oval drawn as a ring of soft bumps. */
const BODY =
  'M130 171 A6.1 6.1 0 0 1 126 180 A7.9 7.9 0 0 1 115 186.6 A9.4 9.4 0 0 1 100 189 ' +
  'A9.4 9.4 0 0 1 85 186.6 A7.9 7.9 0 0 1 74 180 A6.1 6.1 0 0 1 70 171 ' +
  'A6.1 6.1 0 0 1 74 162 A7.9 7.9 0 0 1 85 155.4 A9.4 9.4 0 0 1 100 153 ' +
  'A9.4 9.4 0 0 1 115 155.4 A7.9 7.9 0 0 1 126 162 A6.1 6.1 0 0 1 130 171Z'
/** Pom-pom tail peeking out behind the body. */
const TAIL =
  'M142.5 175 A5.7 5.7 0 0 1 137.8 183.2 A5.7 5.7 0 0 1 128.3 183.2 A5.7 5.7 0 0 1 123.5 175 ' +
  'A5.7 5.7 0 0 1 128.3 166.8 A5.7 5.7 0 0 1 137.8 166.8 A5.7 5.7 0 0 1 142.5 175Z'

const fur = {
  fill: FUR,
  stroke: OUTLINE,
  strokeWidth: 2.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round'
} as const

/** While celebrating, alternates between "in the air" and "landed". */
function useHop(active: boolean): boolean {
  const [airborne, setAirborne] = useState(false)
  useEffect(() => {
    if (!active) return
    const start = setTimeout(() => setAirborne(true), 0)
    const interval = setInterval(() => setAirborne((up) => !up), HOP_MS)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
      setAirborne(false)
    }
  }, [active])
  return airborne
}

interface BunnyProps {
  mood: BunnyMood
  className?: string
}

/**
 * The desk buddy. Each part (ears, eyes, blush, nose, mouth, paws) is its own
 * component with its own spring, so they all move a little out of step.
 */
export function Bunny({ mood, className }: BunnyProps): React.JSX.Element {
  // Idle habits, on unrelated timers so they never line up.
  const blinking = useRandomPulse(2400, 5200, 140)
  const twitching = useRandomPulse(3200, 7000, 120)
  const wiggling = useRandomPulse(5000, 11000, 160)
  const airborne = useHop(mood === 'celebrate')

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      // Let the ear tips poke past the box at the top of a hop instead of being cut off.
      overflow="visible"
      role="img"
      aria-label={`bunny, ${mood}`}
    >
      {/* Centred in the progress ring, with the ear tips just inside it. */}
      <g transform="translate(100 101) scale(0.92) translate(-100 -111)">
        {/* Soft shadow on the ground; it shrinks while the bunny is in the air. */}
        <motion.ellipse
          cx={100}
          cy={196}
          rx={36}
          ry={4}
          fill="var(--deep)"
          initial={false}
          animate={airborne ? { scaleX: 0.75, opacity: 0.12 } : { scaleX: 1, opacity: 0.2 }}
          transition={{ type: 'spring', stiffness: 520, damping: 13 }}
        />

        <motion.g
          initial={false}
          animate={
            airborne ? { y: -17, scaleY: 1.05, scaleX: 0.96 } : { y: 0, scaleY: 1, scaleX: 1 }
          }
          style={{ originX: 0.5, originY: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 13 }}
        >
          <Ears mood={mood} wiggling={wiggling} />

          {/* Tail, body and feet */}
          <path d={TAIL} {...fur} />
          <path d={BODY} {...fur} />
          <ellipse cx={85} cy={188} rx={12} ry={6.5} {...fur} />
          <ellipse cx={115} cy={188} rx={12} ry={6.5} {...fur} />

          {/* Head: dips a little when concentrating */}
          <motion.g
            initial={false}
            animate={{ y: mood === 'focus' ? 1.5 : 0 }}
            transition={SPRING_BOUNCY}
          >
            <path d={HEAD} {...fur} />
            <path d={TUFT} {...fur} />
            <Blush mood={mood} />
            <Eyes mood={mood} blinking={blinking} />
            <Nose twitching={twitching} />
            <Mouth mood={mood} />
          </motion.g>

          <Treats mood={mood} />
        </motion.g>

        {/* "..." while waiting to be un-paused */}
        <AnimatePresence>
          {mood === 'paused' && (
            <motion.g
              key="waiting"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING_BOUNCY}
            >
              {[0, 1, 2].map((dot) => (
                <motion.circle
                  key={dot}
                  cx={153 + dot * 10}
                  cy={62}
                  r={3.2}
                  fill={INK}
                  animate={{ y: [0, -4, 0], opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.18 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </g>
    </svg>
  )
}
