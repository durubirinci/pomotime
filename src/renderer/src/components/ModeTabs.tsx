import { motion } from 'framer-motion'
import { MODES } from '@shared/types'
import { THEMES } from '@renderer/lib/theme'
import { useTimerStore } from '@renderer/store/useTimerStore'

/** Focus / short break / long break. The white pill slides between them. */
export function ModeTabs(): React.JSX.Element {
  const mode = useTimerStore((state) => state.timer.mode)
  const setMode = useTimerStore((state) => state.setMode)

  return (
    <div role="tablist" className="no-drag flex shrink-0 gap-1 rounded-full bg-white/45 p-1">
      {MODES.map((tab) => {
        const selected = tab === mode
        return (
          <motion.button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => !selected && setMode(tab)}
            whileTap={{ scale: 0.9 }}
            className={`relative rounded-full px-3 py-1 text-[13.5px] font-semibold transition-colors duration-300 ${
              selected ? 'text-(--deep)' : 'text-cocoa-soft hover:text-cocoa'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-white shadow-[0_2px_0_rgb(122_87_102/0.12)]"
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              />
            )}
            <span className="relative">{THEMES[tab].label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
