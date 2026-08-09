---
id: useCreateAtom
title: useCreateAtom
---

# Function: useCreateAtom()

## Call Signature

```ts
function useCreateAtom<T>(getValue, options?): ReadonlyAtom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.4\_react@19.2.4\_\_react@19.2.4/node\_modules/@tanstack/react-store/dist/useCreateAtom.d.ts:16

Creates a stable atom instance for the lifetime of the component.

Pass an initial value to create a writable atom, or a getter function to
create a readonly derived atom. This hook mirrors the overloads from
[createAtom](createAtom.md), but ensures the atom is only created once per mount.

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
const countAtom = useCreateAtom(0)
```

## Call Signature

```ts
function useCreateAtom<T>(initialValue, options?): Atom<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+react-store@0.11.0\_react-dom@19.2.4\_react@19.2.4\_\_react@19.2.4/node\_modules/@tanstack/react-store/dist/useCreateAtom.d.ts:17

Creates a stable atom instance for the lifetime of the component.

Pass an initial value to create a writable atom, or a getter function to
create a readonly derived atom. This hook mirrors the overloads from
[createAtom](createAtom.md), but ensures the atom is only created once per mount.

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
const countAtom = useCreateAtom(0)
```
