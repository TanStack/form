---
id: useSelector
title: useSelector
---

# Variable: useSelector()

```ts
const useSelector: <TSource, TSelected>(source, selector?, options?) => TSelected;
```

Re-exported from `@tanstack/react-store`. Use this hook to subscribe to slices of `form.store` (or any TanStack Store source) inside component logic.

## Parameters

### source

A store or atom with `get()` and `subscribe()`.

### selector?

`(snapshot) => TSelected` — strongly recommended; omitting it subscribes to the entire store and may cause extra re-renders.

### options?

- **compare?** — `(a, b) => boolean` custom equality check (defaults to `===`).

## Returns

`TSelected`

## Example

```tsx
import { useForm, useSelector } from '@tanstack/react-form'

const form = useForm({ /* ... */ })
const firstName = useSelector(form.store, (state) => state.values.firstName)
```

## Migration from useStore

`useStore` is a deprecated alias of `useSelector` with the same signature (the third argument is `compare` on `useStore`, or `options.compare` on `useSelector`):

```tsx
// Before
import { useStore } from '@tanstack/react-form'
const firstName = useStore(form.store, (state) => state.values.firstName)

// After
import { useSelector } from '@tanstack/react-form'
const firstName = useSelector(form.store, (state) => state.values.firstName)
```
