import { motion } from 'framer-motion'
import { FUR, OUTLINE, PINK, type BunnyMood } from './types'

/** Where the ears join the head. */
const BASE_Y = 84
const LEFT_X = 78
const RIGHT_X = 122

/** Plump teardrop ear, drawn with its base at 0,0 and its tip pointing up. */
const EAR_OUTER =
  'M0 0 C-10 -6 -17 -26 -14 -41 C-12 -52 -5 -58 0 -58 C5 -58 12 -52 14 -41 C17 -26 10 -6 0 0Z'
const EAR_INNER =
  'M0 -11 C-5.5 -15 -9.5 -28 -8 -39 C-7 -46.5 -3 -50.5 0 -50.5 C3 -50.5 7 -46.5 8 -39 C9.5 -28 5.5 -15 0 -11Z'

interface EarPose {
  left: number
  right: number
  stretch: number
  /** Slides the left ear's base sideways (used when it flops over). */
  leftShift?: number
}

const POSES: Record<BunnyMood, EarPose> = {
  idle: { left: -10, right: 10, stretch: 1 },
  focus: { left: -3, right: 3, stretch: 1.04 },
  snack: { left: -18, right: 18, stretch: 0.97 },
  tea: { left: -24, right: 24, stretch: 0.95 },
  paused: { left: -105, right: 10, stretch: 1, leftShift: -8 },
  celebrate: { left: -15, right: 15, stretch: 1.05 }
}

interface EarProps {
  cx: number
  rotate: number
  stretch: number
  shift?: number
}

function Ear({ cx, rotate, stretch, shift = 0 }: EarProps): React.JSX.Element {
  return (
    <motion.g
      // Pivot at the base of the ear so it swings like a real one.
      style={{ originX: 0.5, originY: 1 }}
      initial={false}
      animate={{ rotate, scaleY: stretch, x: shift }}
      // Loose spring: the ear overshoots and settles, which reads as floppy.
      transition={{ type: 'spring', stiffness: 170, damping: 9, mass: 0.9 }}
    >
      <g transform={`translate(${cx} ${BASE_Y})`}>
        <path d={EAR_OUTER} fill={FUR} stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
        <path d={EAR_INNER} fill={PINK} />
      </g>
    </motion.g>
  )
}

interface EarsProps {
  mood: BunnyMood
  /** Briefly true now and then; nudges the ears so the spring makes them wiggle. */
  wiggling: boolean
}

export function Ears({ mood, wiggling }: EarsProps): React.JSX.Element {
  const pose = POSES[mood]
  const nudge = wiggling && mood !== 'paused' ? 9 : 0
  return (
    <g>
      <Ear cx={LEFT_X} rotate={pose.left - nudge} stretch={pose.stretch} shift={pose.leftShift} />
      <Ear cx={RIGHT_X} rotate={pose.right + (wiggling ? 9 : 0)} stretch={pose.stretch} />
    </g>
  )
}
