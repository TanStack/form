---
id: useSelector
title: useSelector
---

# Variable: useSelector()

```ts
const useSelector: <TSource, TSelected>(source, selector?, options?) => TSelected;
```

Re-exported from `@tanstack/preact-store`. Use this hook to subscribe to slices of `form.store` inside component logic.

## Example

```tsx
import { useForm, useSelector } from '@tanstack/preact-form'

const form = useForm({ /* ... */ })
const firstName = useSelector(form.store, (state) => state.values.firstName)
```

## Migration from useStore

`useStore` is deprecated; import `useSelector` from `@tanstack/preact-form` instead. The API is the same aside from optional `options.compare` instead of a bare `compare` third argument.
