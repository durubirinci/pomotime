import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import type {
  CommandChannels,
  EventChannels,
  InvokeChannels,
  PomoApi,
  Unsubscribe
} from '../shared/ipc'

function invoke<K extends keyof InvokeChannels>(
  channel: K,
  ...args: InvokeChannels[K]['args']
): Promise<InvokeChannels[K]['result']> {
  return ipcRenderer.invoke(channel, ...args)
}

function send<K extends keyof CommandChannels>(channel: K, ...args: CommandChannels[K]): void {
  ipcRenderer.send(channel, ...args)
}

function subscribe<K extends keyof EventChannels>(
  channel: K,
  listener: (...args: EventChannels[K]) => void
): Unsubscribe {
  const handler = (_event: IpcRendererEvent, ...args: unknown[]): void =>
    listener(...(args as EventChannels[K]))
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

const api: PomoApi = {
  platform: process.platform,
  getSnapshot: () => invoke('app:get-snapshot'),
  toggleTimer: () => send('timer:toggle'),
  resetTimer: () => send('timer:reset'),
  skipTimer: () => send('timer:skip'),
  setMode: (mode) => send('timer:set-mode', mode),
  updateSettings: (patch) => send('settings:update', patch),
  minimizeWindow: () => send('window:minimize'),
  closeWindow: () => send('window:close'),
  setMini: (mini) => send('window:set-mini', mini),
  onSnapshot: (listener) => subscribe('app:snapshot', listener),
  onCompleted: (listener) => subscribe('timer:completed', listener)
}

contextBridge.exposeInMainWorld('pomo', api)
