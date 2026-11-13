import { motion } from 'framer-motion'
import { furStroke, type BunnyMood } from './types'

interface EarPose {
  left: number
  right: number
  stretch: number
}

const POSES: Record<BunnyMood, EarPose> = {
  idle: { left: -10, right: 10, stretch: 1 },
  focus: { left: -1, right: 1, stretch: 1.07 },
  snack: { left: -19, right: 19, stretch: 0.95 },
  tea: { left: -25, right: 25, stretch: 0.93 },
  paused: { left: -108, right: 12, stretch: 1 },
  celebrate: { left: -15, right: 15, stretch: 1.07 }
}

const BASE_Y = 86
const TIP_Y = 24

/** A leaf-shaped ear: narrow where it meets the head, fullest two thirds up. */
function earPath(cx: number, inset: number): string {
  const base = BASE_Y - inset * 1.6
  const tip = TIP_Y + inset * 1.5
  const w = 13.5 - inset
  return [
    `M${cx} ${base}`,
    `C${cx - w * 0.85} ${base} ${cx - w * 1.12} ${tip + 32} ${cx - w * 0.9} ${tip + 17}`,
    `C${cx - w * 0.68} ${tip + 5} ${cx - w * 0.25} ${tip} ${cx} ${tip}`,
    `C${cx + w * 0.25} ${tip} ${cx + w * 0.68} ${tip + 5} ${cx + w * 0.9} ${tip + 17}`,
    `C${cx + w * 1.12} ${tip + 32} ${cx + w * 0.85} ${base} ${cx} ${base}Z`
  ].join(' ')
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
      <path d={earPath(cx, 0)} {...furStroke} />
      <path d={earPath(cx, 6)} fill="url(#bunny-ear)" />
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
      <Ear cx={75} rotate={pose.left - nudge} stretch={pose.stretch} />
      <Ear cx={125} rotate={pose.right + (wiggling ? 9 : 0)} stretch={pose.stretch} />
    </g>
  )
}
