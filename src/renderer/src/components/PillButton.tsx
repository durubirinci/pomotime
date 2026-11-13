import { motion, type HTMLMotionProps } from 'framer-motion'
import { SPRING_SQUISH } from '@renderer/lib/theme'

interface PillButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary'
}

/** Chunky pill button that squishes like a marshmallow when pressed. */
export function PillButton({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: PillButtonProps): React.JSX.Element {
  const look =
    variant === 'primary'
      ? 'bg-(--accent) text-white shadow-[0_5px_0_var(--deep)] px-6 text-[19px] min-w-[124px]'
      : 'bg-white text-cocoa shadow-[0_5px_0_rgb(122_87_102/0.16)] px-4 text-[15px]'
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06, y: -2 }}
      // Wider and flatter, as if pressed into the desk.
      whileTap={{ scaleX: 1.1, scaleY: 0.8, y: 4 }}
      transition={SPRING_SQUISH}
      className={`no-drag flex h-11 items-center justify-center gap-1.5 rounded-full font-semibold transition-colors duration-700 ${look} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
