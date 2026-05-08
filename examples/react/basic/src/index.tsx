import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { ArrayExample } from './array'
import { SchemaExample } from './schema'
import { LiteDebouncer } from '@tanstack/pacer-lite'

const ARRAY = [...new Array(1000).keys()]
const values = ARRAY.map((i) => ({ id: i, message: 'Field ' + i }))

const debouncer = new LiteDebouncer(() => {}, { wait: 500 })

function App() {
  const [tab, setTab] = useState<'array' | 'schema'>('array')

  const [count, setCount] = useState(0)

  debouncer.fn = () => setCount((p) => p + 1)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TanStack Form - Array field</h1>
      <div>Count {count}</div>
      <button
        type="button"
        onClick={() => {
          debouncer.maybeExecute()
        }}
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => {
          if (debouncer.options.wait === 500) {
            debouncer.options.wait = 2000
          } else {
            debouncer.options.wait = 500
          }
        }}
      >
        Change debounce
      </button>
      <button onClick={() => setTab('array')} disabled={tab === 'array'}>
        Array example
      </button>
      &nbsp;
      <button onClick={() => setTab('schema')} disabled={tab === 'schema'}>
        Schema example
      </button>
      <br />
      <br />
      {tab === 'array' && <ArrayExample />}
      {tab === 'schema' && <SchemaExample />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
