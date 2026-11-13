import { app, globalShortcut, Notification, type BrowserWindow } from 'electron'
import type { AppSnapshot, CompletionEvent } from '../shared/types'
import { MODES } from '../shared/types'
import { handleCommand, handleInvoke, sendEvent } from './ipc'
import * as persistence from './persistence'
import * as timer from './timer'
import { createTray, type TrayHandle } from './tray'
import { applyAlwaysOnTop, applyMini, createMainWindow, resourcePath, showWindow } from './window'

const TOGGLE_SHORTCUT = 'CommandOrControl+Shift+P'

let mainWindow: BrowserWindow | null = null
let tray: TrayHandle | null = null
let mini = false

function snapshot(): AppSnapshot {
  return {
    timer: timer.timerStore.getState(),
    settings: persistence.getSettings(),
    stats: persistence.getStats(),
    mini
  }
}

/** Push the latest state to the window and the tray. */
function broadcast(): void {
  const state = timer.timerStore.getState()
  sendEvent(mainWindow, 'app:snapshot', snapshot())
  tray?.refreshMenu(state, mini)
  tray?.refreshTime(state, timer.remainingNow())
}

function setMini(next: boolean): void {
  if (!mainWindow || next === mini) return
  mini = next
  applyMini(mainWindow, mini)
  // The mini bunny always floats; the full window follows the setting.
  applyAlwaysOnTop(mainWindow, mini || persistence.getSettings().alwaysOnTop)
  if (mini) showWindow(mainWindow)
  broadcast()
}

function notify({ finished, next }: CompletionEvent): void {
  if (!Notification.isSupported()) return
  const body =
    finished === 'focus'
      ? next === 'longBreak'
        ? 'long break time!! 🐰💕 you earned it'
        : 'break time!! 🐰💕'
      : 'break is over! back to focus 🥕✨'
  const notification = new Notification({
    title: 'POMOTIME!',
    body,
    // The app plays its own gentle chime (and respects the mute toggle).
    silent: true,
    icon: resourcePath('icon.png')
  })
  notification.on('click', () => mainWindow && showWindow(mainWindow))
  notification.show()
}

function registerIpc(): void {
  handleInvoke('app:get-snapshot', snapshot)
  handleCommand('timer:toggle', timer.toggle)
  handleCommand('timer:reset', timer.reset)
  handleCommand('timer:skip', timer.skip)
  handleCommand('timer:set-mode', (mode) => {
    if (MODES.includes(mode)) timer.setMode(mode)
  })
  handleCommand('settings:update', (patch) => {
    const settings = persistence.updateSettings(patch)
    if (mainWindow) applyAlwaysOnTop(mainWindow, mini || settings.alwaysOnTop)
    timer.applySettings()
    broadcast()
  })
  handleCommand('window:minimize', () => mainWindow?.minimize())
  handleCommand('window:close', () => app.quit())
  handleCommand('window:set-mini', (next) => setMini(Boolean(next)))
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => mainWindow && showWindow(mainWindow))

  app.whenReady().then(() => {
    // Needed for notifications to show the right name on Windows.
    app.setAppUserModelId('com.pomotime.app')

    registerIpc()
    mainWindow = createMainWindow(persistence.getSettings().alwaysOnTop)
    mainWindow.on('closed', () => {
      mainWindow = null
    })

    tray = createTray({
      toggle: timer.toggle,
      reset: timer.reset,
      skip: timer.skip,
      showWindow: () => mainWindow && showWindow(mainWindow),
      toggleMini: () => setMini(!mini),
      quit: () => app.quit()
    })

    timer.timerStore.subscribe(broadcast)
    timer.onTick(() => {
      if (timer.rollOverDay()) broadcast()
      else tray?.refreshTime(timer.timerStore.getState(), timer.remainingNow())
    })
    timer.onCompleted((event) => {
      sendEvent(mainWindow, 'timer:completed', event)
      notify(event)
    })
    // Catch midnight even while the timer is sitting idle.
    setInterval(() => timer.rollOverDay(), 60_000)
    broadcast()

    if (!globalShortcut.register(TOGGLE_SHORTCUT, timer.toggle)) {
      console.warn(`POMOTIME: could not register ${TOGGLE_SHORTCUT} (already taken?)`)
    }
  })

  app.on('will-quit', () => globalShortcut.unregisterAll())

  // The window is the app: closing it quits on every platform, macOS included.
  app.on('window-all-closed', () => app.quit())
}
