import { useEffect, useState } from 'react'
import { formatClock, remainingAt } from '@shared/types'
import { useTimerStore } from '@renderer/store/useTimerStore'

const REFRESH_MS = 100

export interface Countdown {
  remainingMs: number
  /** 0 at the start of a session, 1 when it is over. */
  progress: number
  /** "24:59" */
  clock: string
}

/**
 * Time left, recomputed from the session's end timestamp on every frame.
 * Nothing is counted here, so a throttled or hidden window cannot drift.
 */
export function useCountdown(): Countdown {
  const timer = useTimerStore((state) => state.timer)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (timer.status !== 'running') return
    let frame = requestAnimationFrame(function loop() {
      setNow((previous) => {
        const current = Date.now()
        return Math.abs(current - previous) >= REFRESH_MS ? current : previous
      })
      frame = requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(frame)
  }, [timer.status, timer.endsAt])

  // `now` can be a moment stale right after starting, hence the clamp.
  const remainingMs = Math.min(timer.durationMs, remainingAt(timer, now))
  const progress = timer.durationMs > 0 ? 1 - remainingMs / timer.durationMs : 0
  return { remainingMs, progress, clock: formatClock(remainingMs) }
}
