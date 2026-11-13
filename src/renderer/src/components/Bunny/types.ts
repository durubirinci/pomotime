export type BunnyMood =
  /** Waiting to begin: relaxed, blinking, fidgeting. */
  | 'idle'
  /** Focus session running: concentrating, ears straight up. */
  | 'focus'
  /** Short break: eyes closed, munching a carrot. */
  | 'snack'
  /** Long break: eyes closed, holding a tiny cup of tea. */
  | 'tea'
  /** Paused: one ear flopped, peeking at you. */
  | 'paused'
  /** Session complete: deep blush, hopping, hearts. */
  | 'celebrate'

/** Fur is a soft top-to-bottom gradient defined once in the bunny's <defs>. */
export const FUR = 'url(#bunny-fur)'
export const OUTLINE = '#cf9db0'
export const INK = '#4f3644'
export const PINK = '#ffb3c7'

export const furStroke = { fill: FUR, stroke: OUTLINE, strokeWidth: 2.6 } as const
