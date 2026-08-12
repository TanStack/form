---
id: FieldGroupFieldNameForSlot
title: FieldGroupFieldNameForSlot
---

# Type Alias: FieldGroupFieldNameForSlot\<TData, TSlot\>

```ts
type FieldGroupFieldNameForSlot<TData, TSlot> = { [TName in DeepKeys<TData>]: FieldGroupFieldSlotAllows<TSlot, DeepValue<TData, TName>> extends true ? TName : never }[DeepKeys<TData>];
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:56](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L56)

## Type Parameters

### TData

`TData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
