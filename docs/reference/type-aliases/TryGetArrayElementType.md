---
id: TryGetArrayElementType
title: TryGetArrayElementType
---

```ts
type TryGetArrayElementType<TValue> = TValue extends ReadonlyArray<infer TElement> ? TElement : never;
```

Defined in: [deep-keys.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L282)

Extracts the element types from mutable or readonly arrays and tuples.

Non-array union members are ignored. If no union member is an array, the
result is `never`.

## Type Parameters

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Remarks

**Important:** The library exports this type to support its type declarations.
Use the form and field APIs instead of using this type directly.
