import { motion } from 'framer-motion'

interface NoseProps {
  /** Briefly true now and then. */
  twitching: boolean
}

export function Nose({ twitching }: NoseProps): React.JSX.Element {
  return (
    <motion.path
      d="M97 127.4 Q100 126.2 103 127.4 Q102.6 130.4 100 131.2 Q97.4 130.4 97 127.4Z"
      fill="#ff8fae"
      initial={false}
      animate={twitching ? { scale: 1.3, y: -1.2, rotate: 10 } : { scale: 1, y: 0, rotate: 0 }}
      // Barely damped, so it jiggles a few times on the way back.
      transition={{ type: 'spring', stiffness: 900, damping: 7, mass: 0.5 }}
    />
  )
}
