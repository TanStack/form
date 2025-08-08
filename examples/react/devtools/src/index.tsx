import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FormDevtools } from '@tanstack/react-form'
import { TanstackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanstackDevtools
      plugins={[
        {
          name: 'Tanstack Form',
          render: <FormDevtools />,
        },
      ]}
    />
  </StrictMode>,
)
