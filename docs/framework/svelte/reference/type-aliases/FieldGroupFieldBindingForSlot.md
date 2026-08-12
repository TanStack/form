---
id: FieldGroupFieldBindingForSlot
title: FieldGroupFieldBindingForSlot
---

# Type Alias: FieldGroupFieldBindingForSlot\<TData, TSlot\>

```ts
type FieldGroupFieldBindingForSlot<TData, TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode> ? TMode extends "strict" ? FieldGroupFieldNameForSlot<TData, TSlot> : DeepKeysWhereValueIncludes<TData, TValue> : never;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:110](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L110)

## Type Parameters

### TData

`TData`

### TSlot

`TSlot` *extends* [`AnyFieldGroupFieldSlot`](AnyFieldGroupFieldSlot.md)
