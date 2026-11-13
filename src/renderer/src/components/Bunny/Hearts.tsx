import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#ff7fa3', '#ff9dba', '#ffb3c7', '#ff6b95']

/** Small seeded generator: random-looking, but the same for a given seed. */
function seededRandom(seed: number): () => number {
  let state = (seed * 2654435761) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface HeartsProps {
  /** Changes for every celebration so a fresh batch is generated. */
  seed: number
  count?: number
}

/** Little hearts that float up, and sparkles that twinkle, when a session is complete. */
export function Hearts({ seed, count = 9 }: HeartsProps): React.JSX.Element {
  const hearts = useMemo(() => {
    const random = seededRandom(seed)
    return Array.from({ length: count }, (_, index) => ({
      id: `${seed}-${index}`,
      left: 12 + random() * 76,
      size: 13 + random() * 11,
      drift: (random() - 0.5) * 46,
      tilt: (random() - 0.5) * 50,
      rise: 105 + random() * 55,
      delay: index * 0.22 + random() * 0.12,
      color: COLORS[index % COLORS.length]
    }))
  }, [seed, count])

  const sparkles = useMemo(() => {
    const random = seededRandom(seed + 101)
    return Array.from({ length: 6 }, (_, index) => ({
      id: `${seed}-sparkle-${index}`,
      left: 4 + random() * 88,
      top: 6 + random() * 70,
      size: 10 + random() * 9,
      delay: 0.1 + index * 0.4 + random() * 0.2
    }))
  }, [seed])

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {sparkles.map((sparkle) => (
        <motion.svg
          key={sparkle.id}
          viewBox="0 0 24 24"
          width={sparkle.size}
          height={sparkle.size}
          className="absolute"
          style={{ left: `${sparkle.left}%`, top: `${sparkle.top}%` }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: [0, 1.25, 0], rotate: 90, opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, delay: sparkle.delay, ease: 'easeInOut' }}
        >
          <path
            d="M12 1 Q13 10 23 12 Q13 14 12 23 Q11 14 1 12 Q11 10 12 1Z"
            fill="#fff3ad"
            stroke="#ffc94f"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
      {hearts.map((heart) => (
        <motion.svg
          key={heart.id}
          viewBox="0 0 24 24"
          width={heart.size}
          height={heart.size}
          className="absolute top-[42%]"
          style={{ left: `${heart.left}%` }}
          initial={{ y: 0, x: 0, scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: -heart.rise,
            x: heart.drift,
            scale: [0, 1.25, 1, 0.85],
            opacity: [0, 1, 1, 0],
            rotate: heart.tilt
          }}
          transition={{ duration: 1.9, delay: heart.delay, ease: 'easeOut' }}
        >
          <path
            d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.9 4.5 6.6 4.5c2.1 0 3.9 1.1 5.4 3 1.5-1.9 3.3-3 5.4-3 3.7 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
            fill={heart.color}
          />
        </motion.svg>
      ))}
    </div>
  )
}
