---
id: FieldGroupFieldBindings
title: FieldGroupFieldBindings
---

# Type Alias: FieldGroupFieldBindings\<TFields, TData\>

```ts
type FieldGroupFieldBindings<TFields, TData> = { [TName in keyof TFields]: FieldGroupFieldBindingForSlot<TData, TFields[TName]> };
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:119](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L119)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

### TData

`TData` = `any`
