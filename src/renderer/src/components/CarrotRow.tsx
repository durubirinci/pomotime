import { motion } from 'framer-motion'
import { SESSIONS_PER_CYCLE } from '@shared/types'
import { useTimerStore } from '@renderer/store/useTimerStore'
import { CarrotIcon, HeartIcon } from './icons'

/** One carrot per finished focus session; four carrots earn a long break. */
export function CarrotRow(): React.JSX.Element {
  const earned = useTimerStore((state) => state.timer.cycleCount)
  const today = useTimerStore((state) => state.stats.today)

  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5">
      <div
        className="flex gap-1.5 text-[25px]"
        role="img"
        aria-label={`${earned} of ${SESSIONS_PER_CYCLE} focus sessions until a long break`}
      >
        {Array.from({ length: SESSIONS_PER_CYCLE }, (_, index) => {
          const filled = index < earned
          return (
            <motion.span
              key={index}
              initial={false}
              animate={
                filled
                  ? { scale: 1, rotate: 0, opacity: 1 }
                  : { scale: 0.86, rotate: -8, opacity: 0.55 }
              }
              transition={{ type: 'spring', stiffness: 380, damping: 9 }}
              className="text-cocoa-soft"
            >
              <CarrotIcon filled={filled} />
            </motion.span>
          )
        })}
      </div>
      <p className="flex items-center gap-1 text-[12.5px] font-medium text-cocoa-soft">
        {today === 0
          ? 'no sessions yet today'
          : `${today} ${today === 1 ? 'session' : 'sessions'} today`}
        <HeartIcon className="text-(--accent) transition-colors duration-700" />
      </p>
    </div>
  )
}
