---
id: useCreateAtom
title: useCreateAtom
---

# Function: useCreateAtom()

## Call Signature

```ts
function useCreateAtom<T>(getValue, options?): ReadonlyAtom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.2\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useCreateAtom.d.ts:25

Creates a stable atom instance for the lifetime of the component.

Pass an initial value to create a writable atom, or a getter function to
create a readonly derived atom. This mirrors [createAtom](createAtom.md), but only
creates the atom once per component mount.

### Type Parameters

#### T

`T`

### Parameters

#### getValue

(`prev?`) => `T`

#### options?

[`AtomOptions`](../interfaces/AtomOptions.md)\<`T`\>

### Returns

[`ReadonlyAtom`](../interfaces/ReadonlyAtom.md)\<`T`\>

### Example

```tsx
function Counter() {
  const countAtom = useCreateAtom(0)
  const [count, setCount] = useAtom(countAtom)

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </button>
  )
}
```

## Call Signature

```ts
function useCreateAtom<T>(initialValue, options?): Atom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+preact-store@0.13.2\_preact@10.29.8/node\_modules/@tanstack/preact-store/dist/useCreateAtom.d.ts:26

Creates a stable atom instance for the lifetime of the component.

Pass an initial value to create a writable atom, or a getter function to
create a readonly derived atom. This mirrors [createAtom](createAtom.md), but only
creates the atom once per component mount.

### Type Parameters

#### T

`T`

### Parameters

#### initialValue

`T`

#### options?

[`AtomOptions`](../interfaces/AtomOptions.md)\<`T`\>

### Returns

[`Atom`](../interfaces/Atom.md)\<`T`\>

### Example

```tsx
function Counter() {
  const countAtom = useCreateAtom(0)
  const [count, setCount] = useAtom(countAtom)

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </button>
  )
}
```
