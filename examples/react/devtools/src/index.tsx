import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTemplate } from '@tanstack/form-core'
import { useTemplate } from '@tanstack/react-form'

function App() {
  const template = React.useMemo(
    () => createTemplate({ message: 'Hello from React with Devtools!' }),
    [],
  )
  const state = useTemplate(template)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TanStack Template - React Devtools Example</h1>
      <p>Message: {state.message}</p>
      <button onClick={() => template.greet()}>Greet (check console)</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
