---
id: _useStore
title: _useStore
---

# Function: \_useStore()

```ts
function _useStore<TState, TActions, TSelected>(
   store, 
   selector, 
   options?): [TSelected, [TActions] extends [never] ? (updater) => void : TActions];
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.7\_react@19.2.7\_\_react@19.2.7/node\_modules/@tanstack/react-store/dist/\_useStore.d.ts:22

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

\[`TSelected`, \[`TActions`\] *extends* \[`never`\] ? (`updater`) => `void` : `TActions`\]

## Example

```tsx
// Store with actions
const [cats, { addCat }] = _useStore(petStore, (s) => s.cats)

// Store without actions
const [count, setState] = _useStore(plainStore, (s) => s)
setState((prev) => prev + 1)
```
