import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRandomPulse } from '@renderer/hooks/useRandomPulse'
import { SPRING_BOUNCY, SPRING_SOFT } from '@renderer/lib/theme'
import { Blush } from './Blush'
import { Ears } from './Ears'
import { Eyes } from './Eyes'
import { Mouth } from './Mouth'
import { Nose } from './Nose'
import { Treats } from './Treats'
import { INK, furStroke, type BunnyMood } from './types'

export type { BunnyMood } from './types'

const HOP_MS = 300

/** How far the head leans for each mood, in degrees. */
const HEAD_TILT: Record<BunnyMood, number> = {
  idle: 0,
  focus: 0,
  snack: -3,
  tea: 4,
  paused: -6,
  celebrate: 0
}

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

/**
 * Invisible box that pins a group's bounding box, so "origin: bottom centre"
 * stays in the same place even while ears and paws move around inside it.
 */
function Anchor({ height }: { height: number }): React.JSX.Element {
  return <rect width={200} height={height} fill="none" />
}

interface BunnyProps {
  mood: BunnyMood
  /** Zoom in on the face and crop to the ring; for very small sizes. */
  closeUp?: boolean
  className?: string
}

/**
 * The desk buddy. Each part (ears, eyes, blush, nose, mouth, paws) is its own
 * component with its own spring, so they all move a little out of step.
 */
export function Bunny({ mood, closeUp = false, className }: BunnyProps): React.JSX.Element {
  // Idle habits, on unrelated timers so they never line up.
  const blinking = useRandomPulse(2400, 5200, 140)
  const twitching = useRandomPulse(3200, 7000, 120)
  const wiggling = useRandomPulse(5000, 11000, 160)
  const airborne = useHop(mood === 'celebrate')

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`bunny, ${mood}`}>
      <defs>
        {/* White fur that warms to pink underneath, which gives each shape some roundness. */}
        <linearGradient id="bunny-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe9f0" />
        </linearGradient>
        <linearGradient id="bunny-ear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc4d4" />
          <stop offset="1" stopColor="#ff9fba" />
        </linearGradient>
        <clipPath id="bunny-crop">
          <circle cx={100} cy={100} r={86} />
        </clipPath>
      </defs>

      {/* Full view: the ear tips just reach the edge of the progress ring. */}
      <g clipPath={closeUp ? 'url(#bunny-crop)' : undefined}>
        <g
          transform={
            closeUp
              ? 'translate(100 100) scale(1.16) translate(-100 -99)'
              : 'translate(100 100) scale(0.9) translate(-100 -110)'
          }
        >
          {/* Shadow on the ground; it shrinks while the bunny is in the air. */}
          <motion.ellipse
            cx={100}
            cy={196}
            rx={34}
            ry={4}
            fill="#7a5766"
            initial={false}
            animate={airborne ? { scaleX: 0.65, opacity: 0.07 } : { scaleX: 1, opacity: 0.14 }}
            transition={{ type: 'spring', stiffness: 520, damping: 13 }}
          />

          <motion.g
            initial={false}
            animate={
              airborne ? { y: -18, scaleY: 1.05, scaleX: 0.96 } : { y: 0, scaleY: 1, scaleX: 1 }
            }
            style={{ originX: 0.5, originY: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 13 }}
          >
            <Anchor height={196} />

            {/* Slow breathing, so it never looks frozen. */}
            <motion.g
              style={{ originX: 0.5, originY: 1 }}
              animate={{ scaleY: [1, 1.02, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Anchor height={196} />

              {/* Tail, body and feet */}
              <circle cx={131} cy={178} r={9} {...furStroke} />
              <ellipse cx={100} cy={169} rx={31} ry={23} {...furStroke} />
              <ellipse cx={81} cy={189} rx={13.5} ry={7.2} {...furStroke} />
              <ellipse cx={119} cy={189} rx={13.5} ry={7.2} {...furStroke} />

              {/* Head: the ears ride along when it tilts */}
              <motion.g
                style={{ originX: 0.5, originY: 1 }}
                initial={false}
                animate={{ rotate: HEAD_TILT[mood], y: mood === 'focus' ? 1.5 : 0 }}
                transition={SPRING_SOFT}
              >
                <Anchor height={160} />
                <Ears mood={mood} wiggling={wiggling} />
                {/* Widest just below the middle, for chubby cheeks. */}
                <path
                  d="M100 70 C131 70 157 88 158 117 C159 144 133 160 100 160 C67 160 41 144 42 117 C43 88 69 70 100 70Z"
                  {...furStroke}
                />
                {/* A little tuft of fur between the ears. */}
                <path
                  d="M92.5 71.5 Q95 63 99 69.5 Q101.5 61 105 69 Q108 64.5 108.5 71.5"
                  {...furStroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Blush mood={mood} />
                <Eyes mood={mood} blinking={blinking} />
                <Nose twitching={twitching} />
                <Mouth mood={mood} />
              </motion.g>

              <Treats mood={mood} />
            </motion.g>
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
                    cx={152 + dot * 9}
                    cy={64}
                    r={3}
                    fill={INK}
                    animate={{ y: [0, -4, 0], opacity: [0.35, 0.9, 0.35] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.18 }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </g>
    </svg>
  )
}
