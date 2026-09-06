import { BottomBar } from '../components/layout/BottomBar'
import { Header } from '../components/layout/Header'
import { Inspector } from '../components/layout/Inspector'
import { Sidebar } from '../components/layout/Sidebar'
import { KeyboardWorkspace } from '../features/keyboard/KeyboardWorkspace'

export default function App() {
  return <div className="app-shell"><Header /><Sidebar /><KeyboardWorkspace /><Inspector /><BottomBar /></div>
}

