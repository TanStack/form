---
id: devtools
title: Devtools
---

TanStack Form comes with a ready to go suite of devtools.

## Setup

Install the [TanStack Devtools](https://tanstack.com/devtools/latest/docs/quick-start) library and the [TanStack Form plugin](http://npmjs.com/package/@tanstack/solid-form-devtools), from the framework adapter that you're working in (in this case `@tanstack/solid-devtools`, and `@tanstack/solid-form-devtools`).

```bash
npm i @tanstack/solid-devtools
npm i @tanstack/solid-form-devtools
```

Next in the root of your application import the `TanStackDevtools`.

```tsx
import { TanStackDevtools } from '@tanstack/solid-devtools'

import App from './App'

render(
  () => (
    <>
      <App />

      <TanStackDevtools />
    </>
  ),
  root!,
)
```

Import the `formDevtoolsPlugin` from **TanStack Form** and provide it to the `TanStackDevtools` component.

```tsx
import { TanStackDevtools } from '@tanstack/solid-devtools'
import { formDevtoolsPlugin } from '@tanstack/solid-form-devtools'

import App from './app'

const root = document.getElementById('root')

render(
  () => (
    <>
      <App />

      <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
    </>
  ),
  root!,
)
```

Finally add any additional configuration you desire to the `TanStackDevtools` component, more information can be found under the [TanStack Devtools Configuration](https://tanstack.com/devtools/) section.

A complete working example can be found in our [examples section](https://tanstack.com/form/latest/docs/framework/solid/examples/devtools).
