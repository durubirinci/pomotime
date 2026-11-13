export type Mode = 'focus' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

export const MODES: readonly Mode[] = ['focus', 'shortBreak', 'longBreak']

/** Focus sessions needed before a long break. */
export const SESSIONS_PER_CYCLE = 4

export interface TimerState {
  mode: Mode
  status: TimerStatus
  /** Full length of the current session. */
  durationMs: number
  /** Time left while idle or paused. While running, derive it from `endsAt`. */
  remainingMs: number
  /** Wall-clock timestamp the session ends at; only set while running. */
  endsAt: number | null
  /** Focus sessions finished in the current set of four (the carrot row). */
  cycleCount: number
}

export interface Settings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  autoStartBreaks: boolean
  soundEnabled: boolean
  alwaysOnTop: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: false,
  soundEnabled: true,
  alwaysOnTop: false
}

export const MIN_MINUTES = 1
export const MAX_MINUTES = 120

/** One finished focus session, as saved in the history file. */
export interface SessionRecord {
  completedAt: number
  minutes: number
}

export interface DayCount {
  /** Local date, YYYY-MM-DD. */
  date: string
  count: number
}

export interface Stats {
  today: number
  /** The last seven days, oldest first, ending with today. */
  week: DayCount[]
}

/** Everything the renderer needs to draw itself. */
export interface AppSnapshot {
  timer: TimerState
  settings: Settings
  stats: Stats
  mini: boolean
}

export interface CompletionEvent {
  finished: Mode
  next: Mode
}

/** Time left right now, whatever the status. */
export function remainingAt(timer: TimerState, now: number): number {
  if (timer.status === 'running' && timer.endsAt !== null) {
    return Math.max(0, timer.endsAt - now)
  }
  return timer.remainingMs
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
