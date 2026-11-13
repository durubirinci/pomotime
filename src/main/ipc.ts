import { ipcMain, type BrowserWindow } from 'electron'
import type { CommandChannels, EventChannels, InvokeChannels } from '../shared/ipc'

/** Typed wrappers so channel names and payloads are checked on both sides. */

export function handleInvoke<K extends keyof InvokeChannels>(
  channel: K,
  handler: (...args: InvokeChannels[K]['args']) => InvokeChannels[K]['result']
): void {
  ipcMain.handle(channel, (_event, ...args) => handler(...(args as InvokeChannels[K]['args'])))
}

export function handleCommand<K extends keyof CommandChannels>(
  channel: K,
  handler: (...args: CommandChannels[K]) => void
): void {
  ipcMain.on(channel, (_event, ...args) => handler(...(args as CommandChannels[K])))
}

export function sendEvent<K extends keyof EventChannels>(
  window: BrowserWindow | null,
  channel: K,
  ...args: EventChannels[K]
): void {
  if (!window || window.isDestroyed()) return
  window.webContents.send(channel, ...args)
}
