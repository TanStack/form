import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanStackDevtools
      plugins={[formDevtoolsPlugin()]}
      eventBusConfig={{ debug: true }}
    />
  </StrictMode>,
)
