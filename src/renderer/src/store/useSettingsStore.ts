import { create } from 'zustand'
import { DEFAULT_SETTINGS, type AppSnapshot, type Settings } from '@shared/types'

interface SettingsStore {
  settings: Settings
  /** Tiny floating bunny mode. */
  mini: boolean
  panelOpen: boolean

  applySnapshot: (snapshot: AppSnapshot) => void
  update: (patch: Partial<Settings>) => void
  setMini: (mini: boolean) => void
  setPanelOpen: (open: boolean) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: DEFAULT_SETTINGS,
  mini: false,
  panelOpen: false,

  applySnapshot: ({ settings, mini }) => set({ settings, mini }),
  update: (patch) => {
    // Update right away so toggles feel instant; main confirms with a snapshot.
    set((state) => ({ settings: { ...state.settings, ...patch } }))
    window.pomo.updateSettings(patch)
  },
  setMini: (mini) => {
    set({ panelOpen: false })
    window.pomo.setMini(mini)
  },
  setPanelOpen: (panelOpen) => set({ panelOpen })
}))
