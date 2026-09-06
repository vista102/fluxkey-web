import type { CSSProperties } from 'react'
import { useFluxKeyStore } from '../../store/useFluxKeyStore'
import type { KeyboardLayer } from '../../types'

const keyboardRows = [
  [['Esc', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['−', 1], ['=', 1], ['Backspace', 2], ['Del', 1]],
  [['Tab', 1.5], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.5], ['Home', 1]],
  [['Caps', 1.75], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['Enter', 2.25], ['PgUp', 1]],
  [['Shift', 2.25], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['Shift', 1.75], ['↑', 1], ['PgDn', 1]],
  [['Ctrl', 1.25], ['Win', 1.25], ['Alt', 1.25], ['Space', 6.25], ['Alt', 1.25], ['Fn', 1.25], ['Ctrl', 1.25], ['←', 1], ['↓', 1], ['→', 1]],
] as const

const sectionNames = {
  keymap: 'Keymap', actuation: 'Actuation', 'rapid-trigger': 'Rapid Trigger', rgb: 'RGB', macros: 'Macros', device: 'Device',
}

export function KeyboardWorkspace() {
  const selectedKey = useFluxKeyStore((state) => state.selectedKey)
  const setSelectedKey = useFluxKeyStore((state) => state.setSelectedKey)
  const activeSection = useFluxKeyStore((state) => state.activeSection)
  const currentLayer = useFluxKeyStore((state) => state.currentLayer)
  const setCurrentLayer = useFluxKeyStore((state) => state.setCurrentLayer)

  return (
    <main className="workspace">
      <div className="workspace-toolbar">
        <div><span className="eyebrow">Configuration</span><h1>{sectionNames[activeSection]}</h1></div>
        <div className="layer-control" aria-label="Current layer">
          <span>Layer</span>
          {([0, 1, 2, 3] as KeyboardLayer[]).map((layer) => (
            <button key={layer} type="button" data-active={currentLayer === layer} onClick={() => setCurrentLayer(layer)}>{layer}</button>
          ))}
        </div>
      </div>
      <section className="keyboard-stage" aria-label="FluxKey 75 keyboard preview">
        <div className="stage-readout"><span>KEY TRAVEL</span><strong>0.30 <small>mm</small></strong></div>
        <div className="keyboard-frame">
          <div className="keyboard-topline"><span>FLUXKEY 75 HE</span><span>HALL EFFECT · ANALOG INPUT</span></div>
          <div className="keyboard-grid">
            {keyboardRows.map((row, rowIndex) => (
              <div className="keyboard-row" key={rowIndex}>
                {row.map(([key, width], keyIndex) => (
                  <button className="keycap" data-selected={selectedKey === key} key={`${rowIndex}-${keyIndex}-${key}`} style={{ '--key-width': width } as CSSProperties} type="button" onClick={() => setSelectedKey(key)}>
                    <span>{key}</span>{selectedKey === key && <i aria-hidden="true" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="workspace-status"><span><i /> Selected: {selectedKey}</span><span>Click a key to inspect its configuration</span></div>
      </section>
    </main>
  )
}

