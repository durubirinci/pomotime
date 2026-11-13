import { useTimerStore } from '@renderer/store/useTimerStore'
import { PillButton } from './PillButton'
import { PauseIcon, PlayIcon, ResetIcon, SkipIcon } from './icons'

export function Controls(): React.JSX.Element {
  const status = useTimerStore((state) => state.timer.status)
  const toggle = useTimerStore((state) => state.toggle)
  const reset = useTimerStore((state) => state.reset)
  const skip = useTimerStore((state) => state.skip)
  const running = status === 'running'

  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <PillButton onClick={reset} title="Reset this session">
        <ResetIcon />
        reset
      </PillButton>
      <PillButton variant="primary" onClick={toggle} title="Start / pause (Space)">
        {running ? <PauseIcon /> : <PlayIcon />}
        {running ? 'pause' : status === 'paused' ? 'resume' : 'start'}
      </PillButton>
      <PillButton onClick={skip} title="Skip to the next session">
        skip
        <SkipIcon />
      </PillButton>
    </div>
  )
}
