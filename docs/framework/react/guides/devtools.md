---
id: devtools
title: Devtools
---

TanStack Form comes with a ready to go suit of devtools.

## Setup

Install the [TanStack Devtools](https://tanstack.com/devtools/latest/docs/quick-start) library and the [TanStack Form plugin](http://npmjs.com/package/@tanstack/react-form-devtools), from the framework adapter that your working in (in this case `@tanstack/react-devtools`, and `@tanstack/react-form-devtools`).

```bash
npm i @tanstack/react-devtools
npm i @tanstack/react-form-devtools
```

Next in the root of your application import the `TanstackDevtools`.

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

Import the `FormDevtoolsPlugin` from **TanStack Form** and provide it to the `TanstackDevtools` component.

```tsx
import { TanstackDevtools } from '@tanstack/react-devtools'
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanstackDevtools plugins={[FormDevtoolsPlugin()]} />
  </StrictMode>,
)
```

Finally add any additional configuration you desire to the `TanstackDevtools` component, more information can be found under the [TanStack Devtools Configuration](https://tanstack.com/devtools/) section.

A complete working example can be found in our [examples section](https://tanstack.com/form/latest/docs/framework/react/examples/devtools).
