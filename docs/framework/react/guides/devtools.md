---
id: devtools
title: Devtools
---

TanStack Form integrates with the TanStack Devtools shell through a form plugin.

## Install

```bash
npm install @tanstack/react-devtools @tanstack/react-form-devtools
```

## Add the plugin

Render one `TanStackDevtools` instance near the root of the application and pass
it `formDevtoolsPlugin()`.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
  </StrictMode>,
)
```

The plugin discovers mounted forms through the adapter's devtools bridge. Use
it to inspect current values, validation state, field metadata, and registered
fields while developing.

The shell also accepts configuration such as `hideUntilHover`:

```tsx
<TanStackDevtools
  plugins={[formDevtoolsPlugin()]}
  config={{ hideUntilHover: false }}
/>
```

See the [TanStack Devtools documentation](https://tanstack.com/devtools) for
shell placement and configuration.
