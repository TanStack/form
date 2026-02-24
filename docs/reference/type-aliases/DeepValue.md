---
id: DeepValue
title: DeepValue
---

# Type Alias: DeepValue\<TValue, TAccessor\>

```ts
type DeepValue<TValue, TAccessor> = unknown extends TValue ? TValue : TAccessor extends DeepKeys<TValue> ? DeepRecord<TValue>[TAccessor] : never;
```

Defined in: [packages/form-core/src/util-types.ts:168](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L168)

Infer the type of a deeply nested property within an object or an array.

## Type Parameters

### TValue

`TValue`

### TAccessor

`TAccessor`
