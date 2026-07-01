---
id: InferUnion
title: InferUnion
---

# Type Alias: InferUnion\<TBase, TIncoming\>

```ts
type InferUnion<TBase, TIncoming> = TBase extends BuiltInType ? TBase | TIncoming : TIncoming extends BuiltInType ? TBase | TIncoming : TBase extends ReadonlyArray<unknown> ? TIncoming extends ReadonlyArray<unknown> ? InferUnion<TBase[number], TIncoming[number]>[] : TBase | TIncoming : TBase extends object ? TIncoming extends object ? InferUnionObject<TBase, TIncoming> : TBase | TIncoming : TBase | TIncoming;
```

Defined in: [packages/form-core/src/utils.public.ts:25](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L25)

## Type Parameters

### TBase

`TBase`

### TIncoming

`TIncoming`
