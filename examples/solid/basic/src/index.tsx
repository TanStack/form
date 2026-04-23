import { render } from 'solid-js/web'
import { createTemplate } from '@tanstack/form-core'
import { createTemplateSignal } from '@tanstack/solid-form'

function App() {
  const template = createTemplate({ message: 'Hello from Solid!' })
  const state = createTemplateSignal(template)

  return (
    <div style={{ padding: '20px', 'font-family': 'sans-serif' }}>
      <h1>TanStack Template - Solid Basic Example</h1>
      <p>Message: {state().message}</p>
      <button onClick={() => template.greet()}>Greet (check console)</button>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
