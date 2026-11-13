import { useEffect } from 'react'
import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { useTimerStore } from '@renderer/store/useTimerStore'
import { playChime } from '@renderer/lib/chime'

/** Keeps both stores in step with the main process. Mount once, at the top. */
export function useAppSync(): void {
  useEffect(() => {
    let cancelled = false
    const apply: Parameters<typeof window.pomo.onSnapshot>[0] = (snapshot) => {
      useTimerStore.getState().applySnapshot(snapshot)
      useSettingsStore.getState().applySnapshot(snapshot)
    }

    window.pomo.getSnapshot().then((snapshot) => {
      if (!cancelled) apply(snapshot)
    })
    const offSnapshot = window.pomo.onSnapshot(apply)
    const offCompleted = window.pomo.onCompleted(() => {
      useTimerStore.getState().celebrate()
      if (useSettingsStore.getState().settings.soundEnabled) playChime()
    })

    return () => {
      cancelled = true
      offSnapshot()
      offCompleted()
    }
  }, [])
}
