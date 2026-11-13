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

/** Little hearts that float up and fade when a session is complete. */
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

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
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
