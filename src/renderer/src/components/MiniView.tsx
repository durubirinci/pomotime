import { motion } from 'framer-motion'
import type { Countdown as CountdownValue } from '@renderer/hooks/useCountdown'
import { useBunnyMood } from '@renderer/hooks/useBunnyMood'
import { SPRING_BOUNCY, THEMES } from '@renderer/lib/theme'
import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { useTimerStore } from '@renderer/store/useTimerStore'
import { Bunny } from './Bunny'
import { Countdown } from './Countdown'
import { IconButton } from './IconButton'
import { TimerRing } from './TimerRing'
import { ExpandIcon, PauseIcon, PlayIcon } from './icons'

/** Mini mode: just the bunny and the countdown, floating above everything. */
export function MiniView({ countdown }: { countdown: CountdownValue }): React.JSX.Element {
  const mode = useTimerStore((state) => state.timer.mode)
  const status = useTimerStore((state) => state.timer.status)
  const toggle = useTimerStore((state) => state.toggle)
  const setMini = useSettingsStore((state) => state.setMini)
  const mood = useBunnyMood()

  return (
    <motion.div
      className="drag flex size-full items-center gap-2 pr-2.5 pl-2"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING_BOUNCY}
    >
      <TimerRing
        progress={countdown.progress}
        animated={status === 'running'}
        strokeWidth={10}
        className="h-[66px] shrink-0"
      >
        <Bunny mood={mood} closeUp className="size-full" />
      </TimerRing>
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <Countdown clock={countdown.clock} mode={mode} className="text-[29px]" />
        <span className="mt-0.5 text-[11px] leading-none font-semibold text-(--deep) transition-colors duration-700">
          {status === 'paused' ? 'paused' : THEMES[mode].label}
        </span>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <IconButton label={status === 'running' ? 'Pause' : 'Start'} onClick={toggle}>
          {status === 'running' ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <IconButton label="Back to full size" onClick={() => setMini(false)}>
          <ExpandIcon />
        </IconButton>
      </div>
    </motion.div>
  )
}
