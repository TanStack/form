import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { ArrayExample } from './array'
import { SchemaExample } from './schema'

const ARRAY = [...new Array(1000).keys()]
const values = ARRAY.map((i) => ({ id: i, message: 'Field ' + i }))

function App() {
  const [tab, setTab] = useState<'array' | 'schema'>('array')

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TanStack Form - Array field</h1>
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
