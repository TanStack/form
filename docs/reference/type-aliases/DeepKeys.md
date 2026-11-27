---
id: DeepKeys
title: DeepKeys
---

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: [deep-keys.public.ts:219](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L219)

Constructs a union of field paths, including parent fields and subfields.

Object properties use dot notation. Array elements use bracket notation.
Array indices and record keys can vary. Tuples use their known indices.

An `any` or `unknown` input resolves to `string`.

## Type Parameters

### T

`T`

Library-managed. Do not specify explicitly.

## Remarks

**Important:** The library exports this type to support its type declarations.
Use the form and field APIs instead of using this type directly.
