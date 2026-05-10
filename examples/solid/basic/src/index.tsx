import { render } from 'solid-js/web'
import { Show, createSignal } from 'solid-js'
import { ArrayIndexExample } from './arrayIndex'
import { ArrayForExample } from './arrayFor'

type Tabs = 'arrayFor' | 'arrayIndex'

function App() {
  const [tab, setTab] = createSignal<Tabs>('arrayFor')

  return (
    <div style={{ padding: '20px', 'font-family': 'sans-serif' }}>
      <h1>TanStack Form - Solid Array Field</h1>
      <button
        onClick={() => setTab('arrayFor')}
        disabled={tab() === 'arrayFor'}
      >
        Array with <code>For</code>
      </button>
      &nbsp;
      <button
        onClick={() => setTab('arrayIndex')}
        disabled={tab() === 'arrayIndex'}
      >
        Array with <code>Index</code>
      </button>
      <br />
      <br />
      <Show when={tab() === 'arrayIndex'}>
        <ArrayIndexExample />
      </Show>
      <Show when={tab() === 'arrayFor'}>
        <ArrayForExample />
      </Show>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
