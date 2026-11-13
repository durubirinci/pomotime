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

export const FUR = '#ffffff'
export const OUTLINE = '#e3bfcc'
export const INK = '#5d4452'
export const PINK = '#ffb3c7'
