import { Menu, Tray, nativeImage } from 'electron'
import { formatClock, type Mode, type TimerState } from '../shared/types'
import { resourcePath } from './window'

const MODE_LABEL: Record<Mode, string> = {
  focus: 'Focus',
  shortBreak: 'Short break',
  longBreak: 'Long break'
}

export interface TrayActions {
  toggle(): void
  reset(): void
  skip(): void
  showWindow(): void
  toggleMini(): void
  quit(): void
}

export interface TrayHandle {
  /** Call when mode, status or mini mode changes. */
  refreshMenu(timer: TimerState, mini: boolean): void
  /** Call every tick; cheap when the text has not changed. */
  refreshTime(timer: TimerState, remainingMs: number): void
}

export function createTray(actions: TrayActions): TrayHandle | null {
  const isMac = process.platform === 'darwin'
  let tray: Tray
  try {
    // macOS picks the @2x file and tints the template image for light/dark menu bars.
    tray = new Tray(
      nativeImage.createFromPath(resourcePath(isMac ? 'trayTemplate.png' : 'tray.png'))
    )
  } catch (error) {
    // Some Linux desktops have no tray at all; the app works fine without it.
    console.warn('POMOTIME: tray unavailable', error)
    return null
  }

  let lastText = ''
  if (!isMac) tray.on('click', actions.showWindow)

  return {
    refreshMenu(timer, mini) {
      const running = timer.status === 'running'
      tray.setContextMenu(
        Menu.buildFromTemplate([
          { label: `POMOTIME! · ${MODE_LABEL[timer.mode]}`, enabled: false },
          { type: 'separator' },
          {
            label: running ? 'Pause' : 'Start',
            accelerator: 'CommandOrControl+Shift+P',
            registerAccelerator: false,
            click: actions.toggle
          },
          { label: 'Reset', click: actions.reset },
          { label: 'Skip', click: actions.skip },
          { type: 'separator' },
          { label: 'Show window', click: actions.showWindow },
          { label: 'Mini mode', type: 'checkbox', checked: mini, click: actions.toggleMini },
          { type: 'separator' },
          { label: 'Quit', click: actions.quit }
        ])
      )
    },
    refreshTime(timer, remainingMs) {
      const clock = formatClock(remainingMs)
      const text = `${clock}|${timer.status}|${timer.mode}`
      if (text === lastText) return
      lastText = text
      const suffix = timer.status === 'paused' ? ' (paused)' : ''
      // The menu bar shows text next to the icon on macOS only; elsewhere it is the tooltip.
      if (isMac) tray.setTitle(` ${clock}`, { fontType: 'monospacedDigit' })
      tray.setToolTip(`POMOTIME! · ${MODE_LABEL[timer.mode]} ${clock}${suffix}`)
    }
  }
}
