import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

export const FULL_SIZE = { width: 360, height: 520 }
export const MINI_SIZE = { width: 212, height: 84 }

export function resourcePath(file: string): string {
  return join(__dirname, '../../resources', file)
}

export function createMainWindow(alwaysOnTop: boolean): BrowserWindow {
  const window = new BrowserWindow({
    ...FULL_SIZE,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'POMOTIME!',
    icon: resourcePath('icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // Keep animations and the chime alive while minimised.
      backgroundThrottling: false,
      // The chime can follow a timer started from the tray or the shortcut.
      autoplayPolicy: 'no-user-gesture-required'
    }
  })

  applyAlwaysOnTop(window, alwaysOnTop)
  window.once('ready-to-show', () => window.show())

  // The UI never navigates; anything that tries opens in the real browser.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })
  window.webContents.on('will-navigate', (event) => event.preventDefault())

  if (process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return window
}

export function applyAlwaysOnTop(window: BrowserWindow, onTop: boolean): void {
  window.setAlwaysOnTop(onTop, 'floating')
}

/** Shrink to the tiny floating bunny, or grow back, keeping the top-right corner put. */
export function applyMini(window: BrowserWindow, mini: boolean): void {
  const size = mini ? MINI_SIZE : FULL_SIZE
  const bounds = window.getBounds()
  // Some platforms refuse to resize a non-resizable window.
  window.setResizable(true)
  window.setBounds({
    x: bounds.x + bounds.width - size.width,
    y: bounds.y,
    width: size.width,
    height: size.height
  })
  window.setResizable(false)
}

export function showWindow(window: BrowserWindow): void {
  if (window.isMinimized()) window.restore()
  window.show()
  window.focus()
}
