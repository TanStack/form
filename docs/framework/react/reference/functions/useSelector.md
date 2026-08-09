---
id: useSelector
title: useSelector
---

# Function: useSelector()

```ts
function useSelector<TSource, TSelected>(
   source, 
   selector?, 
   options?): TSelected;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.8\_react@19.2.8\_\_react@19.2.8/node\_modules/@tanstack/react-store/dist/useSelector.d.ts:31

Selects a slice of state from an atom or store and subscribes the component
to that selection.

This is the primary React read hook for TanStack Store. It works with any
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

[`UseSelectorOptions`](../interfaces/UseSelectorOptions.md)\<`TSelected`\>

## Returns

`TSelected`

## Examples

```tsx
const count = useSelector(counterStore, (state) => state.count)
```

```tsx
const value = useSelector(countAtom)
```
