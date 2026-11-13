import { createStore } from 'zustand/vanilla'
import {
  SESSIONS_PER_CYCLE,
  remainingAt,
  type CompletionEvent,
  type Mode,
  type Settings,
  type TimerState
} from '../shared/types'
import * as persistence from './persistence'

// POMOTIME_FAST=1 turns minutes into seconds, for trying things out quickly.
const MINUTE_MS = process.env['POMOTIME_FAST'] ? 1000 : 60_000
const TICK_MS = 250

function durationFor(mode: Mode, settings: Settings): number {
  const minutes =
    mode === 'focus'
      ? settings.focusMinutes
      : mode === 'shortBreak'
        ? settings.shortBreakMinutes
        : settings.longBreakMinutes
  return minutes * MINUTE_MS
}

function idleState(mode: Mode, cycleCount: number): TimerState {
  const durationMs = durationFor(mode, persistence.getSettings())
  return { mode, status: 'idle', durationMs, remainingMs: durationMs, endsAt: null, cycleCount }
}

/**
 * The single source of truth for the timer. It lives in the main process so
 * the tray, the global shortcut and notifications keep working while the
 * window is minimised. Everything is derived from the `endsAt` timestamp,
 * never from counting ticks.
 */
export const timerStore = createStore<TimerState>(() =>
  idleState('focus', persistence.getCycleCount())
)

const completionListeners = new Set<(event: CompletionEvent) => void>()
const tickListeners = new Set<() => void>()
let ticker: NodeJS.Timeout | null = null
let currentDay = persistence.dateKey()

export function onCompleted(listener: (event: CompletionEvent) => void): void {
  completionListeners.add(listener)
}

/** Fires a few times a second while running; used to refresh the tray. */
export function onTick(listener: () => void): void {
  tickListeners.add(listener)
}

export function remainingNow(): number {
  return remainingAt(timerStore.getState(), Date.now())
}

function setCycle(count: number): number {
  persistence.setCycleCount(count)
  return count
}

function stopTicker(): void {
  if (ticker) clearInterval(ticker)
  ticker = null
}

function startTicker(): void {
  if (ticker) return
  ticker = setInterval(() => {
    const state = timerStore.getState()
    if (state.status !== 'running' || state.endsAt === null) return stopTicker()
    if (Date.now() >= state.endsAt) complete()
    else tickListeners.forEach((listener) => listener())
  }, TICK_MS)
}

export function start(): void {
  const state = timerStore.getState()
  if (state.status === 'running') return
  const remainingMs = state.remainingMs > 0 ? state.remainingMs : state.durationMs
  timerStore.setState({ status: 'running', remainingMs, endsAt: Date.now() + remainingMs })
  startTicker()
}

export function pause(): void {
  const state = timerStore.getState()
  if (state.status !== 'running') return
  stopTicker()
  timerStore.setState({ status: 'paused', remainingMs: remainingNow(), endsAt: null })
}

export function toggle(): void {
  if (timerStore.getState().status === 'running') pause()
  else start()
}

export function reset(): void {
  stopTicker()
  const { mode, cycleCount } = timerStore.getState()
  timerStore.setState(idleState(mode, cycleCount))
}

export function setMode(mode: Mode): void {
  stopTicker()
  timerStore.setState(idleState(mode, timerStore.getState().cycleCount))
}

/** Works out what follows a session, and what happens to the carrot row. */
function advance(finished: Mode, counted: boolean): { next: Mode; cycleCount: number } {
  let { cycleCount } = timerStore.getState()
  if (finished === 'focus') {
    if (!counted) return { next: 'shortBreak', cycleCount }
    // A full row means the long break was skipped by hand; start a new row.
    if (cycleCount >= SESSIONS_PER_CYCLE) cycleCount = 0
    cycleCount = setCycle(cycleCount + 1)
    return { next: cycleCount >= SESSIONS_PER_CYCLE ? 'longBreak' : 'shortBreak', cycleCount }
  }
  if (finished === 'longBreak' || cycleCount >= SESSIONS_PER_CYCLE) cycleCount = setCycle(0)
  return { next: 'focus', cycleCount }
}

/** Jump to the next session without counting the current one. */
export function skip(): void {
  stopTicker()
  const { next, cycleCount } = advance(timerStore.getState().mode, false)
  timerStore.setState(idleState(next, cycleCount))
}

function complete(): void {
  stopTicker()
  const finished = timerStore.getState()
  if (finished.mode === 'focus') {
    persistence.addSession(Math.round(finished.durationMs / MINUTE_MS))
  }
  const { next, cycleCount } = advance(finished.mode, true)
  timerStore.setState(idleState(next, cycleCount))
  if (next !== 'focus' && persistence.getSettings().autoStartBreaks) start()
  completionListeners.forEach((listener) => listener({ finished: finished.mode, next }))
}

/** Pick up new durations straight away if the current session has not begun. */
export function applySettings(): void {
  const state = timerStore.getState()
  if (state.status === 'idle') timerStore.setState(idleState(state.mode, state.cycleCount))
}

/** At midnight the carrot row starts fresh. Returns true if the day changed. */
export function rollOverDay(): boolean {
  const today = persistence.dateKey()
  if (today === currentDay) return false
  currentDay = today
  timerStore.setState({ cycleCount: persistence.getCycleCount() })
  return true
}
