import { useSettingsStore } from '@renderer/store/useSettingsStore'
import { IconButton } from './IconButton'
import { CloseIcon, GearIcon, MinusIcon, MuteIcon, PinIcon, ShrinkIcon, SoundIcon } from './icons'

/** Custom title bar: drag anywhere on it to move the window. */
export function TitleBar(): React.JSX.Element {
  const settings = useSettingsStore((state) => state.settings)
  const update = useSettingsStore((state) => state.update)
  const setMini = useSettingsStore((state) => state.setMini)
  const setPanelOpen = useSettingsStore((state) => state.setPanelOpen)

  return (
    <div className="drag flex h-11 shrink-0 items-center justify-between px-3">
      <div className="flex gap-1.5">
        <IconButton label="Settings" onClick={() => setPanelOpen(true)}>
          <GearIcon />
        </IconButton>
        <IconButton
          label={settings.alwaysOnTop ? 'Always on top: on' : 'Always on top: off'}
          active={settings.alwaysOnTop}
          onClick={() => update({ alwaysOnTop: !settings.alwaysOnTop })}
        >
          <PinIcon />
        </IconButton>
        <IconButton
          label={settings.soundEnabled ? 'Mute chime' : 'Unmute chime'}
          onClick={() => update({ soundEnabled: !settings.soundEnabled })}
        >
          {settings.soundEnabled ? <SoundIcon /> : <MuteIcon />}
        </IconButton>
        <IconButton label="Mini mode" onClick={() => setMini(true)}>
          <ShrinkIcon />
        </IconButton>
      </div>
      <div className="flex gap-1.5">
        <IconButton label="Minimize" onClick={() => window.pomo.minimizeWindow()}>
          <MinusIcon />
        </IconButton>
        <IconButton label="Close" tone="danger" onClick={() => window.pomo.closeWindow()}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  )
}
