---
id: useSelector
title: useSelector
---

# Function: useSelector()

```ts
function useSelector<TSource, TSelected>(
   source, 
   selector?, 
options?): Readonly<Ref<TSelected>>;
```

Defined in: node\_modules/.pnpm/@tanstack+vue-store@0.11.0\_vue@3.5.34\_typescript@5.9.3\_/node\_modules/@tanstack/vue-store/dist/useSelector.d.ts:33

Selects a slice of state from an atom or store and subscribes the component
to that selection.

This is the primary Vue read hook for TanStack Store. It returns a readonly
ref containing the selected value.

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

`Readonly`\<`Ref`\<`TSelected`\>\>

## Examples

```ts
const count = useSelector(counterStore, (state) => state.count)
console.log(count.value)
```

```ts
const value = useSelector(countAtom)
```
