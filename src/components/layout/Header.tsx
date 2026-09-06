import { ChevronDown, CircleDot, Keyboard, Save } from 'lucide-react'
import { useFluxKeyStore } from '../../store/useFluxKeyStore'

export function Header() {
  const dirty = useFluxKeyStore((state) => state.dirty)
  const markSaved = useFluxKeyStore((state) => state.markSaved)

  return (
    <header className="header">
      <div className="brand" aria-label="FluxKey home">
        <span className="brand-mark"><Keyboard size={18} strokeWidth={1.8} /></span>
        <span>FluxKey</span>
      </div>
      <div className="device-summary">
        <span className="device-dot" aria-hidden="true" />
        <span className="device-name">FluxKey 75 HE</span>
        <span className="device-meta">USB · 1000 Hz</span>
        <ChevronDown size={14} aria-hidden="true" />
      </div>
      <div className="header-actions">
        <span className="connection-state"><CircleDot size={14} /> Demo mode</span>
        <button className="save-button" type="button" onClick={markSaved} disabled={!dirty}>
          <Save size={15} />
          {dirty ? 'Save changes' : 'Saved'}
        </button>
      </div>
    </header>
  )
}

