import { Check, CircleHelp, Usb } from 'lucide-react'
import { useFluxKeyStore } from '../../store/useFluxKeyStore'

export function BottomBar() {
  const dirty = useFluxKeyStore((state) => state.dirty)

  return (
    <footer className="bottom-bar">
      <div className="bottom-group">
        <span><Usb size={14} /> HID preview unavailable</span><span className="divider" /><span>Firmware 0.8.2</span>
      </div>
      <div className="bottom-group">
        <span className={dirty ? 'unsaved-state' : 'saved-state'}><Check size={14} /> {dirty ? 'Unsaved changes' : 'All changes saved'}</span>
        <span><CircleHelp size={14} /> Help</span>
      </div>
    </footer>
  )
}

