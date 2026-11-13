import { motion } from 'framer-motion'
import { FUR, OUTLINE, PINK, type BunnyMood } from './types'

interface EarPose {
  left: number
  right: number
  stretch: number
}

const POSES: Record<BunnyMood, EarPose> = {
  idle: { left: -8, right: 8, stretch: 1 },
  focus: { left: 0, right: 0, stretch: 1.08 },
  snack: { left: -17, right: 17, stretch: 0.95 },
  tea: { left: -22, right: 22, stretch: 0.93 },
  paused: { left: -122, right: 10, stretch: 1 },
  celebrate: { left: -13, right: 13, stretch: 1.08 }
}

interface EarProps {
  cx: number
  rotate: number
  stretch: number
}

function Ear({ cx, rotate, stretch }: EarProps): React.JSX.Element {
  return (
    <motion.g
      // Pivot at the base of the ear so it swings like a real one.
      style={{ originX: 0.5, originY: 1 }}
      initial={false}
      animate={{ rotate, scaleY: stretch }}
      // Loose spring: the ear overshoots and settles, which reads as floppy.
      transition={{ type: 'spring', stiffness: 170, damping: 9, mass: 0.9 }}
    >
      <ellipse cx={cx} cy={50} rx={13} ry={32} fill={FUR} stroke={OUTLINE} strokeWidth={2.5} />
      <ellipse cx={cx} cy={53} rx={6.5} ry={22} fill={PINK} opacity={0.75} />
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
      <Ear cx={80} rotate={pose.left - nudge} stretch={pose.stretch} />
      <Ear cx={120} rotate={pose.right + (wiggling ? 9 : 0)} stretch={pose.stretch} />
    </g>
  )
}
