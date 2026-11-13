import { motion } from 'framer-motion'
import type { Countdown as CountdownValue } from '@renderer/hooks/useCountdown'
import { useBunnyMood } from '@renderer/hooks/useBunnyMood'
import { SPRING_SQUISH } from '@renderer/lib/theme'
import { useTimerStore } from '@renderer/store/useTimerStore'
import { Bunny } from './Bunny'
import { Hearts } from './Bunny/Hearts'
import { CarrotRow } from './CarrotRow'
import { Controls } from './Controls'
import { Countdown } from './Countdown'
import { Header } from './Header'
import { ModeTabs } from './ModeTabs'
import { SettingsPanel } from './SettingsPanel'
import { TimerRing } from './TimerRing'
import { TitleBar } from './TitleBar'

export function FullView({ countdown }: { countdown: CountdownValue }): React.JSX.Element {
  const mode = useTimerStore((state) => state.timer.mode)
  const status = useTimerStore((state) => state.timer.status)
  const celebrating = useTimerStore((state) => state.celebrating)
  const celebrationId = useTimerStore((state) => state.celebrationId)
  const mood = useBunnyMood()

  return (
    <>
      <TitleBar />
      <Header />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-between pt-3 pb-5">
        <ModeTabs />
        <TimerRing
          progress={countdown.progress}
          animated={status === 'running'}
          className="h-[178px]"
        >
          {/* Give the bunny a poke. */}
          <motion.div
            className="no-drag size-full"
            whileTap={{ scaleX: 1.08, scaleY: 0.9 }}
            style={{ originY: 1 }}
            transition={SPRING_SQUISH}
          >
            <Bunny mood={mood} className="size-full" />
          </motion.div>
          {celebrating && <Hearts seed={celebrationId} />}
        </TimerRing>
        <Countdown clock={countdown.clock} mode={mode} className="text-[58px]" />
        <CarrotRow />
        <Controls />
      </main>
      <SettingsPanel />
    </>
  )
}
