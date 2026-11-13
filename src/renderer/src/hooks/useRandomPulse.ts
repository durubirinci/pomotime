import { useEffect, useState } from 'react'

/**
 * Flips to true for `holdMs` at random intervals between `minMs` and `maxMs`.
 * Drives the bunny's little idle habits: blinks, nose twitches, ear wiggles.
 */
export function useRandomPulse(minMs: number, maxMs: number, holdMs: number): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const schedule = (): void => {
      timeout = setTimeout(
        () => {
          setActive(true)
          timeout = setTimeout(() => {
            setActive(false)
            schedule()
          }, holdMs)
        },
        minMs + Math.random() * (maxMs - minMs)
      )
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [minMs, maxMs, holdMs])

  return active
}
