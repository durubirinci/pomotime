import { useEffect, type RefObject } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

/** How far the eyes can travel, in the bunny's own SVG units. */
const REACH = 2.8
/** Cursor distance (px) at which the eyes are turned as far as they go. */
const FULL_TURN_PX = 90

export interface Gaze {
  x: MotionValue<number>
  y: MotionValue<number>
}

/**
 * Makes the bunny's eyes follow the cursor while it is over the window.
 * Returns spring-smoothed offsets; they settle back to centre when the
 * cursor leaves or when `enabled` is false.
 */
export function useGaze(target: RefObject<Element | null>, enabled: boolean): Gaze {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 240, damping: 20 })
  const y = useSpring(rawY, { stiffness: 240, damping: 20 })

  useEffect(() => {
    const lookAhead = (): void => {
      rawX.set(0)
      rawY.set(0)
    }
    if (!enabled) return lookAhead()

    const onMove = (event: MouseEvent): void => {
      const box = target.current?.getBoundingClientRect()
      if (!box) return
      // Measured from the face, which sits a little below the middle.
      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height * 0.55)
      const distance = Math.hypot(dx, dy) || 1
      const turn = Math.min(1, distance / FULL_TURN_PX)
      rawX.set((dx / distance) * turn * REACH)
      rawY.set((dy / distance) * turn * REACH * 0.8)
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', lookAhead)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', lookAhead)
    }
  }, [enabled, target, rawX, rawY])

  return { x, y }
}
