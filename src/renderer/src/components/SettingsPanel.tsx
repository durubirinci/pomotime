import { AnimatePresence, motion } from 'framer-motion'
import { MAX_MINUTES, MIN_MINUTES, type Settings } from '@shared/types'
import { SPRING_SOFT, SPRING_SQUISH } from '@renderer/lib/theme'
import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { useTimerStore } from '@renderer/store/useTimerStore'
import { PillButton } from './PillButton'
import { MinusIcon, PlusIcon } from './icons'

type MinutesKey = 'focusMinutes' | 'shortBreakMinutes' | 'longBreakMinutes'
type ToggleKey = 'autoStartBreaks' | 'soundEnabled' | 'alwaysOnTop'

const DURATIONS: { key: MinutesKey; label: string }[] = [
  { key: 'focusMinutes', label: 'focus' },
  { key: 'shortBreakMinutes', label: 'short break' },
  { key: 'longBreakMinutes', label: 'long break' }
]

const TOGGLES: { key: ToggleKey; label: string }[] = [
  { key: 'autoStartBreaks', label: 'auto-start breaks' },
  { key: 'soundEnabled', label: 'chime sound' },
  { key: 'alwaysOnTop', label: 'always on top' }
]

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function StepButton(props: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <motion.button
      type="button"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      whileTap={{ scale: 0.78 }}
      transition={SPRING_SQUISH}
      className="grid size-7 place-items-center rounded-full bg-(--soft) text-[13px] text-(--deep) disabled:opacity-35"
    >
      {props.children}
    </motion.button>
  )
}

function Stepper(props: {
  label: string
  value: number
  onChange: (value: number) => void
}): React.JSX.Element {
  const { label, value, onChange } = props
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-1.5">
        <StepButton
          label={`${label}: one minute less`}
          disabled={value <= MIN_MINUTES}
          onClick={() => onChange(value - 1)}
        >
          <MinusIcon />
        </StepButton>
        <span className="w-[58px] text-center font-semibold tabular-nums">{value} min</span>
        <StepButton
          label={`${label}: one minute more`}
          disabled={value >= MAX_MINUTES}
          onClick={() => onChange(value + 1)}
        >
          <PlusIcon />
        </StepButton>
      </div>
    </div>
  )
}

function Toggle(props: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}): React.JSX.Element {
  const { label, checked, onChange } = props
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`flex h-7 w-12 items-center rounded-full p-[3px] transition-colors duration-300 ${
          checked ? 'justify-end bg-(--accent)' : 'justify-start bg-cocoa-soft/30'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
          className="size-[22px] rounded-full bg-white shadow-sm"
        />
      </button>
    </label>
  )
}

/** Seven tiny bars: focus sessions finished on each of the last seven days. */
function WeekChart(): React.JSX.Element {
  const week = useTimerStore((state) => state.stats.week)
  const max = Math.max(4, ...week.map((day) => day.count))
  return (
    <div className="flex items-end justify-between gap-1.5 px-1">
      {week.map((day, index) => {
        const isToday = index === week.length - 1
        return (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-0.5">
            <span className="text-[10.5px] leading-none font-semibold text-cocoa-soft">
              {day.count || ''}
            </span>
            <div className="flex h-7 w-full items-end rounded-full bg-(--soft)">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / max) * 100}%` }}
                transition={{ ...SPRING_SOFT, delay: 0.1 + index * 0.04 }}
                className={`w-full rounded-full ${isToday ? 'bg-(--deep)' : 'bg-(--accent)'}`}
              />
            </div>
            <span
              className={`text-[10.5px] leading-none ${isToday ? 'font-bold text-(--deep)' : 'text-cocoa-soft'}`}
            >
              {WEEKDAYS[new Date(`${day.date}T12:00:00`).getDay()]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Slides up over the timer like a sheet of note paper. */
export function SettingsPanel(): React.JSX.Element {
  const open = useSettingsStore((state) => state.panelOpen)
  const settings = useSettingsStore((state) => state.settings)
  const update = useSettingsStore((state) => state.update)
  const setPanelOpen = useSettingsStore((state) => state.setPanelOpen)
  const set = <K extends keyof Settings>(key: K, value: Settings[K]): void =>
    update({ [key]: value } as Pick<Settings, K>)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="no-drag absolute inset-0 z-30 bg-cocoa/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
          />
          <motion.section
            key="sheet"
            role="dialog"
            aria-label="Settings"
            className="no-drag absolute inset-x-0 bottom-0 z-40 flex flex-col gap-2.5 rounded-t-[30px] bg-cream px-5 pt-3 pb-4 text-[14.5px] font-medium shadow-[0_-6px_24px_rgb(122_87_102/0.18)]"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            exit={{ y: '105%', transition: { duration: 0.22, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <div className="mx-auto h-1.5 w-10 rounded-full bg-cocoa-soft/30" />
            <h2 className="text-center text-[19px] leading-none font-bold text-(--deep)">
              settings
            </h2>

            <div className="flex flex-col gap-1.5">
              {DURATIONS.map(({ key, label }) => (
                <Stepper
                  key={key}
                  label={label}
                  value={settings[key]}
                  onChange={(value) => set(key, value)}
                />
              ))}
            </div>
            <hr className="border-t-2 border-dashed border-cocoa-soft/25" />
            <div className="flex flex-col gap-1.5">
              {TOGGLES.map(({ key, label }) => (
                <Toggle
                  key={key}
                  label={label}
                  checked={settings[key]}
                  onChange={(checked) => set(key, checked)}
                />
              ))}
            </div>
            <hr className="border-t-2 border-dashed border-cocoa-soft/25" />
            <div>
              <p className="mb-1 text-[12.5px] text-cocoa-soft">focus sessions this week</p>
              <WeekChart />
            </div>

            <PillButton
              variant="primary"
              className="mx-auto mt-0.5"
              onClick={() => setPanelOpen(false)}
            >
              done
            </PillButton>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}
