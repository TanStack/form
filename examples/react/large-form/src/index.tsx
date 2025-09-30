import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'

import App from './App.tsx'

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[FormDevtoolsPlugin()]}
    />
  </React.StrictMode>,
)
