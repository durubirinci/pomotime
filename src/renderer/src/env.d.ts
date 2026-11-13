/// <reference types="vite/client" />
import type { PomoApi } from '@shared/ipc'

declare global {
  interface Window {
    pomo: PomoApi
  }
}
