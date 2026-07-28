import { NinjaCursor } from './components/Cursor/NinjaCursor'
import { Terminal } from './components/Terminal/Terminal'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <div className="animated-background" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />
      <div className="dark-overlay" aria-hidden="true" />
      <Terminal />
      <NinjaCursor />
    </main>
  )
}

export default App
