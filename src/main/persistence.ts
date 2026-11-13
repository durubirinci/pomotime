import Store from 'electron-store'
import {
  DEFAULT_SETTINGS,
  MAX_MINUTES,
  MIN_MINUTES,
  SESSIONS_PER_CYCLE,
  type DayCount,
  type SessionRecord,
  type Settings,
  type Stats
} from '../shared/types'

interface Schema {
  settings: Settings
  /** Every finished focus session, oldest first. */
  history: SessionRecord[]
  /** Carrot row progress, tagged with the day it belongs to. */
  cycle: { date: string; count: number }
}

const MAX_HISTORY = 5000

// Saved as pomotime.json in the app's user-data folder.
const store = new Store<Schema>({
  name: 'pomotime',
  defaults: {
    settings: DEFAULT_SETTINGS,
    history: [],
    cycle: { date: '', count: 0 }
  }
})

export function dateKey(time: number | Date = new Date()): string {
  const d = new Date(time)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

function clampMinutes(value: unknown, fallback: number): number {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return fallback
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, n))
}

/** Never trust what is on disk or what arrives over IPC. */
function sanitizeSettings(input: Partial<Settings>, base: Settings): Settings {
  const bool = (value: unknown, fallback: boolean): boolean =>
    typeof value === 'boolean' ? value : fallback
  return {
    focusMinutes: clampMinutes(input.focusMinutes, base.focusMinutes),
    shortBreakMinutes: clampMinutes(input.shortBreakMinutes, base.shortBreakMinutes),
    longBreakMinutes: clampMinutes(input.longBreakMinutes, base.longBreakMinutes),
    autoStartBreaks: bool(input.autoStartBreaks, base.autoStartBreaks),
    soundEnabled: bool(input.soundEnabled, base.soundEnabled),
    alwaysOnTop: bool(input.alwaysOnTop, base.alwaysOnTop)
  }
}

function readHistory(): SessionRecord[] {
  const history = store.get('history')
  return Array.isArray(history) ? history : []
}

export function getSettings(): Settings {
  return sanitizeSettings(store.get('settings') ?? {}, DEFAULT_SETTINGS)
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const next = sanitizeSettings(patch ?? {}, getSettings())
  store.set('settings', next)
  return next
}

export function addSession(minutes: number): void {
  const history = readHistory()
  history.push({ completedAt: Date.now(), minutes })
  store.set('history', history.slice(-MAX_HISTORY))
}

/** Carrots earned today; yesterday's carrots do not carry over. */
export function getCycleCount(): number {
  const cycle = store.get('cycle')
  if (!cycle || cycle.date !== dateKey()) return 0
  const count = Math.round(Number(cycle.count))
  return Number.isFinite(count) ? Math.min(SESSIONS_PER_CYCLE, Math.max(0, count)) : 0
}

export function setCycleCount(count: number): void {
  store.set('cycle', { date: dateKey(), count })
}

export function getStats(): Stats {
  const counts = new Map<string, number>()
  for (const record of readHistory()) {
    const key = dateKey(record.completedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const week: DayCount[] = []
  for (let offset = 6; offset >= 0; offset--) {
    const day = new Date()
    day.setDate(day.getDate() - offset)
    const key = dateKey(day)
    week.push({ date: key, count: counts.get(key) ?? 0 })
  }
  return { today: week[6].count, week }
}
