import { useTimerStore } from '@renderer/store/useTimerStore'
import type { BunnyMood } from '@renderer/components/Bunny/types'

/** Turns timer state into how the bunny is feeling. */
export function useBunnyMood(): BunnyMood {
  const mode = useTimerStore((state) => state.timer.mode)
  const status = useTimerStore((state) => state.timer.status)
  const celebrating = useTimerStore((state) => state.celebrating)

  if (celebrating) return 'celebrate'
  if (status === 'paused') return 'paused'
  if (mode === 'shortBreak') return 'snack'
  if (mode === 'longBreak') return 'tea'
  return status === 'running' ? 'focus' : 'idle'
}
