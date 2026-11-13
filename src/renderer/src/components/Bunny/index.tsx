import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGaze } from '@renderer/hooks/useGaze'
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

const POKE_MS = 1100

/** Give the bunny a poke and it beams at you for a moment. */
function usePoke(): { poked: boolean; pokeCount: number; poke: () => void } {
  const [poked, setPoked] = useState(false)
  const [pokeCount, setPokeCount] = useState(0)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])
  const poke = (): void => {
    setPoked(true)
    setPokeCount((count) => count + 1)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setPoked(false), POKE_MS)
  }
  return { poked, pokeCount, poke }
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
  const { poked, pokeCount, poke } = usePoke()
  const svgRef = useRef<SVGSVGElement>(null)
  // It watches your cursor, unless it is busy concentrating.
  const gaze = useGaze(svgRef, mood === 'idle' || mood === 'paused')
  // The face lights up when poked; ears, paws and props carry on as they were.
  const face: BunnyMood = poked ? 'celebrate' : mood

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`bunny, ${mood}`}
      onPointerDown={poke}
    >
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
              {/* Soft shadow the head casts on the chest */}
              <ellipse cx={100} cy={160} rx={26} ry={9} fill="#f3c2d3" opacity={0.5} />
              {[81, 119].map((cx) => (
                <g key={cx}>
                  <ellipse cx={cx} cy={189} rx={13.5} ry={7.2} {...furStroke} />
                  <ellipse cx={cx} cy={190.5} rx={5.5} ry={2.6} fill="#ffc4d4" />
                </g>
              ))}

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
                {/* Fluffy cheeks */}
                <path
                  d="M46.5 110.5 Q37 113.5 42.5 119 Q35.5 122.5 45 128"
                  {...furStroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M153.5 110.5 Q163 113.5 157.5 119 Q164.5 122.5 155 128"
                  {...furStroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Blush mood={face} />
                <Eyes mood={face} blinking={blinking} gaze={gaze} />
                <Nose twitching={twitching} />
                <Mouth mood={face} />
              </motion.g>

              <Treats mood={mood} />
            </motion.g>
          </motion.g>

          {/* A heart pops out when poked */}
          <AnimatePresence>
            {poked && (
              <motion.g
                key={pokeCount}
                initial={{ y: 6, scale: 0, opacity: 0 }}
                animate={{ y: -16, scale: 1, opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <path
                  transform="translate(150 84) rotate(14) scale(0.95)"
                  d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.9 4.5 6.6 4.5c2.1 0 3.9 1.1 5.4 3 1.5-1.9 3.3-3 5.4-3 3.7 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
                  fill="#ff7fa3"
                />
              </motion.g>
            )}
          </AnimatePresence>

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
