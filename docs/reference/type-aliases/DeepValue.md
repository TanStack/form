---
id: DeepValue
title: DeepValue
---

```ts
type DeepValue<TValue, TAccessor> = unknown extends TValue ? TValue : TAccessor extends DeepKeys<TValue> ? DeepValueImpl<TValue, TAccessor> : never;
```

Defined in: [deep-keys.public.ts:239](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L239)

Resolves the value type at a field path in `TValue`.

The result includes `undefined` when a parent can be `null` or `undefined`,
or a property is absent from a union member.

For `any` or `unknown`, the result preserves `TValue`.
Otherwise, a path outside [DeepKeys](DeepKeys.md) resolves to `never`.

## Type Parameters

### TValue

`TValue`

Library-managed. Do not specify explicitly.

### TAccessor

`TAccessor` *extends* `string`

Library-managed. Do not specify explicitly.

## Remarks

**Important:** The library exports this type to support its type declarations.
Use the form and field APIs instead of using this type directly.
