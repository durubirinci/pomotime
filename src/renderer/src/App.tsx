import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FullView } from './components/FullView'
import { MiniView } from './components/MiniView'
import { useAppSync } from './hooks/useAppSync'
import { useCountdown } from './hooks/useCountdown'
import { THEMES } from './lib/theme'
import { useSettingsStore } from './store/useSettingsStore'
import { useTimerStore } from './store/useTimerStore'

/** Space starts and pauses; Escape closes the settings sheet. */
function useKeyboard(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') useSettingsStore.getState().setPanelOpen(false)
      if (event.code === 'Space' && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault()
        useTimerStore.getState().toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

export default function App(): React.JSX.Element | null {
  useAppSync()
  useKeyboard()
  const ready = useTimerStore((state) => state.ready)
  const mode = useTimerStore((state) => state.timer.mode)
  const mini = useSettingsStore((state) => state.mini)
  const countdown = useCountdown()
  const theme = THEMES[mode]

  if (!ready) return null

  return (
    <motion.div
      className="relative flex size-full flex-col overflow-hidden rounded-[30px] border-[2.5px] border-white/80"
      // The whole palette eases from one mode's colours to the next.
      initial={false}
      animate={{
        backgroundColor: theme.bg,
        '--accent': theme.accent,
        '--deep': theme.deep,
        '--soft': theme.soft
      }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <div className="polka pointer-events-none absolute inset-0" />
      <div className="relative flex size-full flex-col">
        {mini ? <MiniView countdown={countdown} /> : <FullView countdown={countdown} />}
      </div>
    </motion.div>
  )
}
