import type { AppSnapshot, CompletionEvent, Mode, Settings } from './types'

/** Renderer → main, request/response (ipcRenderer.invoke). */
export interface InvokeChannels {
  'app:get-snapshot': { args: []; result: AppSnapshot }
}

/** Renderer → main, fire-and-forget (ipcRenderer.send). */
export interface CommandChannels {
  'timer:toggle': []
  'timer:reset': []
  'timer:skip': []
  'timer:set-mode': [mode: Mode]
  'settings:update': [patch: Partial<Settings>]
  'window:minimize': []
  'window:close': []
  'window:set-mini': [mini: boolean]
}

/** Main → renderer (webContents.send). */
export interface EventChannels {
  'app:snapshot': [snapshot: AppSnapshot]
  'timer:completed': [event: CompletionEvent]
}

export type Unsubscribe = () => void

/** The API the preload script exposes as `window.pomo`. */
export interface PomoApi {
  platform: NodeJS.Platform
  getSnapshot(): Promise<AppSnapshot>
  toggleTimer(): void
  resetTimer(): void
  skipTimer(): void
  setMode(mode: Mode): void
  updateSettings(patch: Partial<Settings>): void
  minimizeWindow(): void
  closeWindow(): void
  setMini(mini: boolean): void
  onSnapshot(listener: (snapshot: AppSnapshot) => void): Unsubscribe
  onCompleted(listener: (event: CompletionEvent) => void): Unsubscribe
}
