---
id: createStoreContext
title: createStoreContext
---

# Function: createStoreContext()

```ts
function createStoreContext<TValue>(): object;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.8\_react@19.2.8\_\_react@19.2.8/node\_modules/@tanstack/react-store/dist/createStoreContext.d.ts:40

Creates a typed React context for sharing a bundle of atoms and stores with a subtree.

The returned `StoreProvider` only transports the provided object through
React context. Consumers destructure the contextual atoms and stores, then
compose them with the existing hooks like [useSelector](useSelector.md),
[useSelector](useSelector.md) and [useAtom](useAtom.md).

The object shape is preserved exactly, so keyed atoms and stores remain fully
typed when read back with `useStoreContext()`.

## Type Parameters

### TValue

`TValue` *extends* `object`

## Returns

`object`

### StoreProvider

```ts
StoreProvider: (props) => ReactElement;
```

#### Parameters

##### props

`object` & `object`

#### Returns

`ReactElement`

### useStoreContext

```ts
useStoreContext: () => TValue;
```

#### Returns

`TValue`

## Example

```tsx
const { StoreProvider, useStoreContext } = createStoreContext<{
  countAtom: Atom<number>
  totalsStore: Store<{ count: number }>
}>()

function CountButton() {
  const { countAtom, totalsStore } = useStoreContext()
  const count = useSelector(countAtom)
  const total = useSelector(totalsStore, (state) => state.count)

  return (
    <button
      type="button"
      onClick={() => totalsStore.setState((state) => ({ ...state, count: state.count + 1 }))}
    >
      {count} / {total}
    </button>
  )
}
```

## Throws

When `useStoreContext()` is called outside the matching `StoreProvider`.
