import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
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
      <TanStackDevtools
        plugins={[formDevtoolsPlugin()]}
        config={{
          hideUntilHover: false,
        }}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
