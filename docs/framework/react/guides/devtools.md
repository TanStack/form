---
id: devtools
title: Devtools
---

TanStack Form comes with a ready-to-go suite of devtools.

## Setup

Install the [TanStack Devtools](https://tanstack.com/devtools/latest/docs/quick-start) library and the [TanStack Form plugin](http://npmjs.com/package/@tanstack/react-form-devtools), from the framework adapter that you're working in (in this case `@tanstack/react-devtools` and `@tanstack/react-form-devtools`).

```bash
npm i @tanstack/react-devtools
npm i @tanstack/react-form-devtools
```

Next, in the root of your application, import the `TanStackDevtools`.

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanStackDevtools />
  </StrictMode>,
)
```

Import the `formDevtoolsPlugin` from **TanStack Form** and provide it to the `TanStackDevtools` component.

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
  </StrictMode>,
)
```

Finally, add any additional configuration you desire to the `TanStackDevtools` component. More information can be found under the [TanStack Devtools Configuration](https://tanstack.com/devtools/) section.

A complete working example can be found in our [examples section](https://tanstack.com/form/latest/docs/framework/react/examples/devtools).
