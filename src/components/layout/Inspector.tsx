import { SlidersHorizontal } from 'lucide-react'
import { useFluxKeyStore } from '../../store/useFluxKeyStore'

export function Inspector() {
  const selectedKey = useFluxKeyStore((state) => state.selectedKey)

  return (
    <aside className="inspector">
      <div className="inspector-title"><span>Key inspector</span><SlidersHorizontal size={16} /></div>
      <section className="inspector-section selected-key-section">
        <span className="eyebrow">Selected key</span>
        <div className="selected-key-value">{selectedKey}</div>
        <span className="key-coordinate">Position 02 · 03</span>
      </section>
      <section className="inspector-section">
        <div className="metric-heading"><span>Actuation</span><strong>0.30 mm</strong></div>
        <div className="range-track" aria-label="Mock actuation setting"><span /><i /></div>
        <div className="range-labels"><span>0.1</span><span>4.0 mm</span></div>
      </section>
      <section className="inspector-section">
        <div className="property-row"><span>Rapid Trigger</span><span className="status-pill">On</span></div>
        <div className="property-row"><span>Press sensitivity</span><strong>0.15 mm</strong></div>
        <div className="property-row"><span>Release sensitivity</span><strong>0.15 mm</strong></div>
      </section>
      <p className="inspector-note">Demo values only. Device communication is not enabled.</p>
    </aside>
  )
}

