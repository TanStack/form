---
id: useSelector
title: useSelector
---

# Function: useSelector()

```ts
function useSelector<TState, TSelected>(
   source, 
   selector?, 
   options?): object;
```

Defined in: node\_modules/.pnpm/@tanstack+svelte-store@0.12.1\_svelte@5.56.8\_@typescript-eslint+types@8.66.0\_/node\_modules/@tanstack/svelte-store/dist/useSelector.svelte.d.ts:22

Selects a slice of state from an atom or store and exposes it through a
rune-friendly holder object.

Read the selected value from `.current`.

## Type Parameters

### TState

`TState`

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

## Parameters

### source

  \| [`Atom`](../interfaces/Atom.md)\<`TState`\>
  \| [`ReadonlyAtom`](../interfaces/ReadonlyAtom.md)\<`TState`\>
  \| [`Store`](../classes/Store.md)\<`TState`, `any`\>
  \| [`ReadonlyStore`](../classes/ReadonlyStore.md)\<`TState`\>

### selector?

(`state`) => `TSelected`

### options?

[`UseSelectorOptions`](../interfaces/UseSelectorOptions.md)\<`TSelected`\>

## Returns

`object`

### current

```ts
readonly current: TSelected;
```

## Examples

```ts
const count = useSelector(counterStore, (state) => state.count)
console.log(count.current)
```

```ts
const doubled = useSelector(countAtom, (value) => value * 2)
```
