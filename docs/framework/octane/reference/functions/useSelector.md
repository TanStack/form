---
id: useSelector
title: useSelector
---

```ts
function useSelector<TSource, TSelected>(
   source, 
   selector?, 
   options?): TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+octane-store@0.12.2\_octane@0.2.16\_@typescript-eslint+types@8.70.0\_react-dom@1\_a2e82070231a666c986adf906edd0514/node\_modules/@tanstack/octane-store/src/useSelector.ts:48

Selects a slice of state from an atom or store and subscribes the component
to that selection.

This is the primary Octane read hook for TanStack Store. It works with any
source that exposes `get()` and `subscribe()`, including atoms, readonly
atoms, stores, and readonly stores.

Omit the selector to subscribe to the whole value.

## Type Parameters

### TSource

`TSource`

### TSelected

`TSelected` = `NoInfer`\<`TSource`\>

## Parameters

### source

`SelectionSource`\<`TSource`\>

### selector?

(`snapshot`) => `TSelected`

### options?

`UseSelectorOptions`\<`TSelected`\>

## Returns

`TSelected`

## Examples

```tsx
const count = useSelector(counterStore, (state) => state.count)
```

```tsx
const value = useSelector(countAtom)
```
