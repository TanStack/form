---
id: useTransform
title: useTransform
---

# Function: useTransform()

```ts
function useTransform(
  fn: (formBase: AnyFormApi) => AnyFormApi,
  deps?: unknown[],
): (data: unknown) => unknown;
```

A hook used in SSR meta-framework adapters (TanStack Start, Next.js, Remix) to merge server-returned form state with the client-side form instance.

Pass the result directly to the `transform` option of `useForm`. Under the hood it is a stable `useCallback` wrapper, so it only recreates the transform function when `deps` change.

## Parameters

### fn

`(formBase: AnyFormApi) => AnyFormApi`

A function that receives the base form API and returns a transformed form API. Typically calls `mergeForm(baseForm, serverState)` to layer server validation errors or default values on top of the client form.

### deps?

`unknown[]`

Dependency array for the callback, identical to `useCallback`'s second argument. Include any reactive values referenced inside `fn`.

## Returns

`(data: unknown) => unknown`

A stable transform function suitable for the `transform` option of `useForm`.

## Example

```ts
import { mergeForm, useForm, useTransform } from '@tanstack/react-form-start'

// serverState comes from a loader / action / server function
const form = useForm({
  ...formOpts,
  transform: useTransform(
    (baseForm) => mergeForm(baseForm, serverState),
    [serverState],
  ),
})
```

## Notes

- This hook is exported from the meta-framework adapter packages (`@tanstack/react-form-start`, `@tanstack/react-form-nextjs`, `@tanstack/react-form-remix`), not from `@tanstack/react-form` itself.
- For a full SSR integration example see the [React Meta-Framework Usage guide](../guides/ssr.md).

## Defined in

[packages/react-form-nextjs/src/useTransform.ts](https://github.com/TanStack/form/blob/main/packages/react-form-nextjs/src/useTransform.ts)
