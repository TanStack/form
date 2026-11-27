---
id: DeepKeysWhereValueIncludes
title: DeepKeysWhereValueIncludes
---

```ts
type DeepKeysWhereValueIncludes<TData, TValue> = DeepKeysAndValues<TData> extends infer TDeepKeyAndValue ? TDeepKeyAndValue extends AnyDeepKeyAndValue ? Extract<NonNullable<TDeepKeyAndValue["value"]>, TValue> extends never ? never : TDeepKeyAndValue["key"] : never : never;
```

Defined in: [deep-keys.public.ts:261](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L261)

Selects field paths by matching their value types against `TValue`.

The type removes `null` and `undefined` from each field's value type.
A path matches if at least one remaining union member is assignable to
`TValue`.

## Type Parameters

### TData

`TData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Remarks

**Important:** The library exports this type to support its type declarations.
Use the form and field APIs instead of using this type directly.
