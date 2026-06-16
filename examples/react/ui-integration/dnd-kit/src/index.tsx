import { createRoot } from 'react-dom/client'
import { SingleListExample } from './singleList'
import { TwoListsExample } from './twoLists'
import './index.css'

function App() {
  return (
    <div className="app-shell">
      <header>
        <h1>Dnd-kit in TanStack Form Example</h1>
      </header>
      <main className="examples-stack">
        <SingleListExample />
        <TwoListsExample />
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
