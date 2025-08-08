---
id: devtools
title: Devtools
---

TanStack Form comes with a ready to go suit of devtools.

## Setup

Install the [TanStack Devtools](https://tanstack.com/devtools/) library, this will install the devtools core as well as provide you framework specific adapters.

```bash
npm i @tanstack/devtools
```

Next in the root of your application import the `TanstackDevtools` from the required framework adapter (in this case @tanstack/react-devtools).

```tsx
import { TanstackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanstackDevtools />
  </StrictMode>,
)
```

Import the `FormDevtools` form **TanStack Form** and provide it to the `TanstackDevtools` component along with a label for the menu.

```tsx
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
```

Finally add any additional configuration you desire to the `TanstackDevtools` component, more information can be found under the [TanStack Devtools Configuration](https://tanstack.com/devtools/) section.

A complete working example can be found in our [examples section](https://tanstack.com/form/latest/docs/framework/react/examples/devtools).
