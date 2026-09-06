import { create } from 'zustand'
import type { AppSection, KeyboardLayer } from '../types'

interface FluxKeyState {
  selectedKey: string
  activeSection: AppSection
  currentLayer: KeyboardLayer
  dirty: boolean
  setSelectedKey: (key: string) => void
  setActiveSection: (section: AppSection) => void
  setCurrentLayer: (layer: KeyboardLayer) => void
  markSaved: () => void
}

export const useFluxKeyStore = create<FluxKeyState>((set) => ({
  selectedKey: 'W',
  activeSection: 'keymap',
  currentLayer: 0,
  dirty: false,
  setSelectedKey: (selectedKey) => set({ selectedKey }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setCurrentLayer: (currentLayer) => set({ currentLayer, dirty: true }),
  markSaved: () => set({ dirty: false }),
}))

