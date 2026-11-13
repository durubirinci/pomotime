import { AnimatePresence, motion } from 'framer-motion'
import type { Mode } from '@shared/types'
import { SPRING_BOUNCY } from '@renderer/lib/theme'

interface CountdownProps {
  clock: string
  mode: Mode
  className?: string
}

/** The big numbers. Each digit gets a fixed-width slot so nothing jitters. */
export function Countdown({ clock, mode, className = '' }: CountdownProps): React.JSX.Element {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        // A new mode pops the whole clock in afresh.
        key={mode}
        role="timer"
        aria-label={`${clock} remaining`}
        initial={{ scale: 0.6, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.1 } }}
        transition={SPRING_BOUNCY}
        className={`flex justify-center leading-none font-semibold text-cocoa ${className}`}
      >
        {clock.split('').map((char, index) => (
          <span
            key={index}
            aria-hidden
            className={`inline-block text-center ${char === ':' ? 'w-[0.34em] -translate-y-[0.06em]' : 'w-[0.62em]'}`}
          >
            {char}
          </span>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
