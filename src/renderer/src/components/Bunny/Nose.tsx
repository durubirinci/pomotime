import { motion } from 'framer-motion'

interface NoseProps {
  /** Briefly true now and then. */
  twitching: boolean
}

export function Nose({ twitching }: NoseProps): React.JSX.Element {
  return (
    <motion.path
      d="M95.8 118.6 Q100 116.6 104.2 118.6 Q103.6 123 100 124.2 Q96.4 123 95.8 118.6Z"
      fill="#ff8fae"
      initial={false}
      animate={twitching ? { scale: 1.3, y: -1.2, rotate: 10 } : { scale: 1, y: 0, rotate: 0 }}
      // Barely damped, so it jiggles a few times on the way back.
      transition={{ type: 'spring', stiffness: 900, damping: 7, mass: 0.5 }}
    />
  )
}
