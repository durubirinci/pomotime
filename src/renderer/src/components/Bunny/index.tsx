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
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`bunny, ${mood}`}>
      {/* Centred in the progress ring; the ear tips just reach its edge. */}
      <g transform="translate(100 100) scale(0.98) translate(-100 -103)">
        <motion.g
          initial={false}
          animate={
            airborne ? { y: -17, scaleY: 1.05, scaleX: 0.96 } : { y: 0, scaleY: 1, scaleX: 1 }
          }
          style={{ originX: 0.5, originY: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 13 }}
        >
          <Ears mood={mood} wiggling={wiggling} />

          {/* Body and feet */}
          <ellipse
            cx={100}
            cy={162}
            rx={35}
            ry={24}
            fill={FUR}
            stroke={OUTLINE}
            strokeWidth={2.5}
          />
          <ellipse cx={81} cy={184} rx={13} ry={7} fill={FUR} stroke={OUTLINE} strokeWidth={2.5} />
          <ellipse cx={119} cy={184} rx={13} ry={7} fill={FUR} stroke={OUTLINE} strokeWidth={2.5} />

          {/* Head: dips a little when concentrating */}
          <motion.g
            initial={false}
            animate={{ y: mood === 'focus' ? 1.5 : 0 }}
            transition={SPRING_BOUNCY}
          >
            <ellipse
              cx={100}
              cy={114}
              rx={50}
              ry={40}
              fill={FUR}
              stroke={OUTLINE}
              strokeWidth={2.5}
            />
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
                  cx={146 + dot * 9}
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
    </svg>
  )
}
