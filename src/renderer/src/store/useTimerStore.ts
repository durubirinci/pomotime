import { create } from 'zustand'
import type { AppSnapshot, Mode, Stats, TimerState } from '@shared/types'

const CELEBRATION_MS = 3800

interface TimerStore {
  /** False until the first snapshot arrives from the main process. */
  ready: boolean
  timer: TimerState
  stats: Stats
  /** True for a few seconds after a session finishes. */
  celebrating: boolean
  /** Bumps on every celebration so effects can restart. */
  celebrationId: number

  applySnapshot: (snapshot: AppSnapshot) => void
  celebrate: () => void
  toggle: () => void
  reset: () => void
  skip: () => void
  setMode: (mode: Mode) => void
}

let celebrationTimeout: ReturnType<typeof setTimeout> | undefined

/**
 * Mirror of the timer that lives in the main process. The renderer never
 * counts time itself: actions go out over IPC, and fresh state comes back.
 */
export const useTimerStore = create<TimerStore>((set) => ({
  ready: false,
  timer: {
    mode: 'focus',
    status: 'idle',
    durationMs: 25 * 60_000,
    remainingMs: 25 * 60_000,
    endsAt: null,
    cycleCount: 0
  },
  stats: { today: 0, week: [] },
  celebrating: false,
  celebrationId: 0,

  applySnapshot: ({ timer, stats }) => set({ ready: true, timer, stats }),
  celebrate: () => {
    clearTimeout(celebrationTimeout)
    set((state) => ({ celebrating: true, celebrationId: state.celebrationId + 1 }))
    celebrationTimeout = setTimeout(() => set({ celebrating: false }), CELEBRATION_MS)
  },
  toggle: () => window.pomo.toggleTimer(),
  reset: () => window.pomo.resetTimer(),
  skip: () => window.pomo.skipTimer(),
  setMode: (mode) => window.pomo.setMode(mode)
}))
