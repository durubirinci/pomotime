import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { INK, type BunnyMood } from './types'

const LEFT_X = 82
const RIGHT_X = 118
const EYE_Y = 112

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
      <circle cx={cx} cy={EYE_Y} r={5.6} fill={INK} />
      <circle cx={cx - 1.8} cy={EYE_Y - 2} r={1.9} fill="#fff" />
    </motion.g>
  )
}

function Arc({ d }: { d: string }): React.JSX.Element {
  return <path d={d} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
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
                <Arc d={`M${LEFT_X - 6.5} 115 Q${LEFT_X} 105 ${LEFT_X + 6.5} 115`} />
                <Arc d={`M${RIGHT_X - 6.5} 115 Q${RIGHT_X} 105 ${RIGHT_X + 6.5} 115`} />
              </>
            ) : (
              // u u  peacefully closed
              <>
                <Arc d={`M${LEFT_X - 6.5} 110 Q${LEFT_X} 118 ${LEFT_X + 6.5} 110`} />
                <Arc d={`M${RIGHT_X - 6.5} 110 Q${RIGHT_X} 118 ${RIGHT_X + 6.5} 110`} />
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
              openness={mood === 'paused' ? 0.42 : mood === 'focus' ? 0.8 : 1}
              lookX={mood === 'paused' ? 2 : 0}
              blinking={blinking}
            />
            <OpenEye
              cx={RIGHT_X}
              openness={mood === 'focus' ? 0.8 : 1}
              lookX={mood === 'paused' ? 2 : 0}
              blinking={blinking}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Determined little eyebrows while concentrating. */}
      <AnimatePresence>
        {mood === 'focus' && (
          <motion.g
            key="brows"
            initial={{ y: -7, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={SPRING_BOUNCY}
          >
            <Arc d={`M${LEFT_X - 7} 101 L${LEFT_X + 4} 102.6`} />
            <Arc d={`M${RIGHT_X + 7} 101 L${RIGHT_X - 4} 102.6`} />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  )
}
