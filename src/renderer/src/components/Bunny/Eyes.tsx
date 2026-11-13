import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { INK, type BunnyMood } from './types'

const LEFT_X = 79
const RIGHT_X = 121
const EYE_Y = 122

interface OpenEyeProps {
  cx: number
  /** How far open the eye is: 1 is round, 0 is shut. */
  openness: number
  lookX: number
  blinking: boolean
}

function OpenEye({ cx, openness, lookX, blinking }: OpenEyeProps): React.JSX.Element {
  return (
    <motion.g
      initial={false}
      animate={{ scaleY: blinking ? 0.08 : openness, x: lookX }}
      transition={blinking ? { duration: 0.07 } : { type: 'spring', stiffness: 420, damping: 16 }}
    >
      <circle cx={cx} cy={EYE_Y} r={6.5} fill={INK} />
      {/* Two sparkles: a big one up top, a tiny one opposite. */}
      <circle cx={cx - 2.2} cy={EYE_Y - 2.4} r={2.3} fill="#fff" />
      <circle cx={cx + 2.4} cy={EYE_Y + 2.6} r={1.1} fill="#fff" />
    </motion.g>
  )
}

function Arc({ d }: { d: string }): React.JSX.Element {
  return <path d={d} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
}

function Brow({ d }: { d: string }): React.JSX.Element {
  return <path d={d} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
}

interface EyesProps {
  mood: BunnyMood
  blinking: boolean
}

export function Eyes({ mood, blinking }: EyesProps): React.JSX.Element {
  const closed = mood === 'snack' || mood === 'tea' || mood === 'celebrate'

  return (
    <g>
      <AnimatePresence initial={false}>
        {closed ? (
          <motion.g
            key={mood === 'celebrate' ? 'happy' : 'content'}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={SPRING_BOUNCY}
          >
            {mood === 'celebrate' ? (
              // ^ ^  squeezed shut with joy
              <>
                <Arc d={`M${LEFT_X - 6.5} 124.5 Q${LEFT_X} 114.5 ${LEFT_X + 6.5} 124.5`} />
                <Arc d={`M${RIGHT_X - 6.5} 124.5 Q${RIGHT_X} 114.5 ${RIGHT_X + 6.5} 124.5`} />
              </>
            ) : (
              // u u  peacefully closed
              <>
                <Arc d={`M${LEFT_X - 6.5} 120.5 Q${LEFT_X} 128 ${LEFT_X + 6.5} 120.5`} />
                <Arc d={`M${RIGHT_X - 6.5} 120.5 Q${RIGHT_X} 128 ${RIGHT_X + 6.5} 120.5`} />
              </>
            )}
          </motion.g>
        ) : (
          <motion.g
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <OpenEye
              cx={LEFT_X}
              // Paused: the eye under the floppy ear droops, the other one peeks.
              openness={mood === 'paused' ? 0.5 : 1}
              lookX={mood === 'paused' ? 1 : 0}
              blinking={blinking}
            />
            <OpenEye
              cx={RIGHT_X}
              openness={1}
              lookX={mood === 'paused' ? 1 : 0}
              blinking={blinking}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Soft little eyebrows while concentrating. */}
      <AnimatePresence>
        {mood === 'focus' && (
          <motion.g
            key="brows"
            initial={{ y: -7, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={SPRING_BOUNCY}
          >
            <Brow d={`M${LEFT_X - 5.5} 109.6 Q${LEFT_X - 1} 108.2 ${LEFT_X + 3.5} 110`} />
            <Brow d={`M${RIGHT_X + 5.5} 109.6 Q${RIGHT_X + 1} 108.2 ${RIGHT_X - 3.5} 110`} />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  )
}
