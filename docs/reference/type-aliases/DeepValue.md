---
id: DeepValue
title: DeepValue
---

# Type Alias: DeepValue\<TValue, TAccessor\>

```ts
type DeepValue<TValue, TAccessor> = unknown extends TValue ? TValue : TAccessor extends DeepKeys<TValue> ? DeepValueImpl<TValue, TAccessor> : never;
```

Defined in: [deep-keys.public.ts:218](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/deep-keys.public.ts#L218)

Infer the type of a deeply nested property within an object or an array.

## Type Parameters

### TValue

`TValue`

### TAccessor

`TAccessor` *extends* `string`
