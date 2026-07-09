---
id: useSelector
title: useSelector
---

# Function: useSelector()

```ts
function useSelector<TSource, TSelected>(
   source, 
   selector?, 
options?): Accessor<TSelected>;
```

Defined in: node\_modules/.pnpm/@tanstack+solid-store@0.11.0\_solid-js@1.9.13/node\_modules/@tanstack/solid-store/dist/useSelector.d.ts:34

Selects a slice of state from an atom or store and subscribes the component
to that selection.

This is the primary Solid read hook for TanStack Store. It returns a Solid
accessor so consumers can read the selected value reactively.

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

`Accessor`\<`TSelected`\>

## Examples

```tsx
const count = useSelector(counterStore, (state) => state.count)

return <p>{count()}</p>
```

```tsx
const value = useSelector(countAtom)
```
