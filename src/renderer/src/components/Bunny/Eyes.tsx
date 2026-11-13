import { AnimatePresence, motion } from 'framer-motion'
import { SPRING_BOUNCY } from '@renderer/lib/theme'
import { INK, type BunnyMood } from './types'

// Wide-set and low on the face: the recipe for a baby-animal look.
const LEFT_X = 79
const RIGHT_X = 121
const EYE_Y = 119

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
      <ellipse cx={cx} cy={EYE_Y} rx={6.8} ry={7.8} fill={INK} />
      {/* A warm glow at the bottom of the eye, then two sparkles. */}
      <ellipse cx={cx} cy={EYE_Y + 3.6} rx={4.2} ry={3} fill="#a0647c" opacity={0.55} />
      <circle cx={cx - 2.3} cy={EYE_Y - 3} r={2.7} fill="#fff" />
      <circle cx={cx + 2.6} cy={EYE_Y + 2.6} r={1.2} fill="#fff" opacity={0.9} />
    </motion.g>
  )
}

function Arc({ d }: { d: string }): React.JSX.Element {
  return <path d={d} fill="none" stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
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
                <Arc d={`M${LEFT_X - 7.5} 123 Q${LEFT_X} 111 ${LEFT_X + 7.5} 123`} />
                <Arc d={`M${RIGHT_X - 7.5} 123 Q${RIGHT_X} 111 ${RIGHT_X + 7.5} 123`} />
              </>
            ) : (
              // u u  peacefully closed
              <>
                <Arc d={`M${LEFT_X - 7.5} 117.5 Q${LEFT_X} 126.5 ${LEFT_X + 7.5} 117.5`} />
                <Arc d={`M${RIGHT_X - 7.5} 117.5 Q${RIGHT_X} 126.5 ${RIGHT_X + 7.5} 117.5`} />
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
              openness={mood === 'paused' ? 0.45 : mood === 'focus' ? 0.84 : 1}
              lookX={mood === 'paused' ? 2 : 0}
              blinking={blinking}
            />
            <OpenEye
              cx={RIGHT_X}
              openness={mood === 'focus' ? 0.84 : 1}
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
            <Arc d={`M${LEFT_X - 7} 104.5 L${LEFT_X + 5} 107`} />
            <Arc d={`M${RIGHT_X + 7} 104.5 L${RIGHT_X - 5} 107`} />
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  )
}
