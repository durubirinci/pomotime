import { motion, type HTMLMotionProps } from 'framer-motion'
import { SPRING_SQUISH } from '@renderer/lib/theme'

interface IconButtonProps extends HTMLMotionProps<'button'> {
  label: string
  /** Lit up, for toggles that are switched on. */
  active?: boolean
  tone?: 'plain' | 'danger'
}

/** Small round button for the title bar. */
export function IconButton({
  label,
  active = false,
  tone = 'plain',
  className = '',
  children,
  ...props
}: IconButtonProps): React.JSX.Element {
  const colors = active
    ? 'bg-(--accent) text-white'
    : tone === 'danger'
      ? 'bg-white/70 text-cocoa-soft hover:bg-[#ff9aa8] hover:text-white'
      : 'bg-white/70 text-cocoa-soft hover:bg-white hover:text-(--deep)'
  return (
    <motion.button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      whileHover={{ scale: 1.14 }}
      whileTap={{ scale: 0.8 }}
      transition={SPRING_SQUISH}
      className={`no-drag grid size-7 place-items-center rounded-full text-[15px] transition-colors ${colors} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
