import type { Mode } from '@shared/types'

export interface ModeTheme {
  label: string
  /** Window background. */
  bg: string
  /** Lighter tint for the bunny's circle and quiet surfaces. */
  soft: string
  /** Buttons, progress ring, highlights. */
  accent: string
  /** Button "bottom edge" and strong text. */
  deep: string
}

export const THEMES: Record<Mode, ModeTheme> = {
  focus: { label: 'focus', bg: '#ffd6e2', soft: '#ffeaf0', accent: '#ff8fb1', deep: '#e9668f' },
  shortBreak: {
    label: 'short break',
    bg: '#c9f1df',
    soft: '#e4f9ef',
    accent: '#62cfa2',
    deep: '#3fae83'
  },
  longBreak: {
    label: 'long break',
    bg: '#e0d6fb',
    soft: '#f0ebfe',
    accent: '#a98eec',
    deep: '#8668d6'
  }
}

/** Shared springs so everything bounces with the same personality. */
export const SPRING_BOUNCY = { type: 'spring', stiffness: 320, damping: 13 } as const
export const SPRING_SOFT = { type: 'spring', stiffness: 180, damping: 18 } as const
export const SPRING_SQUISH = { type: 'spring', stiffness: 550, damping: 16 } as const
