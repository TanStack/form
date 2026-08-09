---
id: DeepValue
title: DeepValue
---

# Type Alias: DeepValue\<TValue, TAccessor\>

```ts
type DeepValue<TValue, TAccessor> = unknown extends TValue ? TValue : TAccessor extends DeepKeys<TValue> ? DeepValueImpl<TValue, TAccessor> : never;
```

Defined in: [deep-keys.public.ts:215](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/deep-keys.public.ts#L215)

Infer the type of a deeply nested property within an object or an array.

## Type Parameters

### TValue

`TValue`

### TAccessor

`TAccessor` *extends* `string`
