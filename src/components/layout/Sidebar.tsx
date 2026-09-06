import { Activity, Cpu, Gauge, Keyboard, Layers3, Lightbulb, ListChecks } from 'lucide-react'
import { useFluxKeyStore } from '../../store/useFluxKeyStore'
import type { AppSection } from '../../types'

const sections: Array<{ id: AppSection; label: string; icon: typeof Keyboard }> = [
  { id: 'keymap', label: 'Keymap', icon: Keyboard },
  { id: 'actuation', label: 'Actuation', icon: Gauge },
  { id: 'rapid-trigger', label: 'Rapid Trigger', icon: Activity },
  { id: 'rgb', label: 'RGB', icon: Lightbulb },
  { id: 'macros', label: 'Macros', icon: ListChecks },
  { id: 'device', label: 'Device', icon: Cpu },
]

export function Sidebar() {
  const activeSection = useFluxKeyStore((state) => state.activeSection)
  const setActiveSection = useFluxKeyStore((state) => state.setActiveSection)

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Configure</div>
      <nav aria-label="Keyboard settings">
        {sections.map(({ id, label, icon: Icon }) => (
          <button className="nav-item" data-active={activeSection === id} key={id} type="button" onClick={() => setActiveSection(id)}>
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Layers3 size={15} />
        <div><span>Onboard memory</span><strong>Profile 01</strong></div>
      </div>
    </aside>
  )
}

