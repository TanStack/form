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

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.1\_preact@10.29.2/node\_modules/@tanstack/preact-store/dist/useSelector.d.ts:29

Selects a slice of state from an atom or store and subscribes the component
to that selection.

This is the primary Preact read hook for TanStack Store. Use it when a
component only needs part of a source value, or omit the selector to
subscribe to the whole value.

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
