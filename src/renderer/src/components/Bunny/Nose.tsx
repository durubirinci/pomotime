import { motion } from 'framer-motion'

interface NoseProps {
  /** Briefly true now and then. */
  twitching: boolean
}

export function Nose({ twitching }: NoseProps): React.JSX.Element {
  return (
    <motion.path
      d="M95.6 124.2 Q100 121.8 104.4 124.2 Q103.8 128.6 100 129.8 Q96.2 128.6 95.6 124.2Z"
      fill="#ff7fa3"
      initial={false}
      animate={twitching ? { scale: 1.3, y: -1.2, rotate: 10 } : { scale: 1, y: 0, rotate: 0 }}
      // Barely damped, so it jiggles a few times on the way back.
      transition={{ type: 'spring', stiffness: 900, damping: 7, mass: 0.5 }}
    />
  )
}
