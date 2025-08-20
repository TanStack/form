import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { FormDevtools } from '@tanstack/react-form-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanstackDevtools
      config={{ hideUntilHover: true }}
      eventBusConfig={{ debug: true }}
      plugins={[
        {
          name: 'Tanstack Form',
          render: <FormDevtools />,
        },
      ]}
    />
  </StrictMode>,
)
