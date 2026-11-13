import { motion } from 'framer-motion'
import { useRandomPulse } from '@renderer/hooks/useRandomPulse'

const TITLE = 'POMOTIME!'
/** The letter the bunny is hiding behind. */
const EARS_ON = 1

function PeekingEars(): React.JSX.Element {
  const wiggling = useRandomPulse(3500, 8000, 170)
  const spring = { type: 'spring', stiffness: 220, damping: 7 } as const
  return (
    <svg
      viewBox="0 0 40 30"
      className="absolute bottom-[68%] left-[62%] -z-10 h-[0.72em] w-[0.96em] -translate-x-1/2 overflow-visible"
      aria-hidden
    >
      {[
        { cx: 12, rest: -10 },
        { cx: 28, rest: 10 }
      ].map(({ cx, rest }) => (
        <motion.g
          key={cx}
          style={{ originX: 0.5, originY: 1 }}
          animate={{ rotate: wiggling ? rest * 2.2 : rest }}
          transition={spring}
        >
          <ellipse
            cx={cx}
            cy={17}
            rx={6.5}
            ry={15}
            fill="#fff"
            stroke="#cf9db0"
            strokeWidth={1.6}
          />
          <ellipse cx={cx} cy={18} rx={3} ry={10} fill="#ffb3c7" />
        </motion.g>
      ))}
    </svg>
  )
}

/** "POMOTIME!" with a gentle wave of bounces and bunny ears peeking over the O. */
export function Header(): React.JSX.Element {
  return (
    <h1
      className="drag relative z-0 flex shrink-0 justify-center pt-3 text-[38px] leading-none font-bold tracking-wide text-white"
      aria-label={TITLE}
    >
      {TITLE.split('').map((letter, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="relative inline-block [text-shadow:0_3px_0_var(--deep)] transition-[text-shadow] duration-700"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.55,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 3.2,
            delay: 0.4 + index * 0.07
          }}
        >
          {index === EARS_ON && <PeekingEars />}
          {letter}
        </motion.span>
      ))}
    </h1>
  )
}
