---
id: _useStore
title: _useStore
---

# Function: \_useStore()

```ts
function _useStore<TState, TActions, TSelected>(
   store, 
   selector, 
   options?): [{
  current: TSelected;
}, [TActions] extends [never] ? (updater) => void : TActions];
```

Defined in: node\_modules/.pnpm/@tanstack+svelte-store@0.12.1\_svelte@5.56.8\_@typescript-eslint+types@8.66.0\_/node\_modules/@tanstack/svelte-store/dist/\_useStore.d.ts:19

Experimental combined read+write hook for stores, mirroring useAtom's tuple
pattern.

Returns `[selected, actions]` when the store has an actions factory, or
`[selected, setState]` for plain stores.

## Type Parameters

### TState

`TState`

### TActions

`TActions` *extends* [`StoreActionMap`](../type-aliases/StoreActionMap.md)

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

## Parameters

### store

[`Store`](../classes/Store.md)\<`TState`, `TActions`\>

### selector

(`state`) => `TSelected`

### options?

[`UseSelectorOptions`](../interfaces/UseSelectorOptions.md)\<`TSelected`\>

## Returns

\[\{
  `current`: `TSelected`;
\}, \[`TActions`\] *extends* \[`never`\] ? (`updater`) => `void` : `TActions`\]

## Example

```ts
// Store with actions
const [cats, { addCat }] = _useStore(petStore, (s) => s.cats)

// Store without actions
const [count, setState] = _useStore(plainStore, (s) => s)
```
