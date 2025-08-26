import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { FormDevtools } from '@tanstack/react-form-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      // eventBusConfig={{ debug: true }}
      plugins={[
        {
          name: 'Tanstack Form',
          render: <FormDevtools />,
        },
      ]}
    />
  </StrictMode>,
)
