---
id: FieldGroupFieldNames
title: FieldGroupFieldNames
---

# Type Alias: FieldGroupFieldNames\<TData, TFields\>

```ts
type FieldGroupFieldNames<TData, TFields> = { [TName in keyof TFields]: FieldGroupFieldNameForSlot<TData, TFields[TName]> };
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:68](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L68)

## Type Parameters

### TData

`TData`

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
