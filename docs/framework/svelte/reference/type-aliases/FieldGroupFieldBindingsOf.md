---
id: FieldGroupFieldBindingsOf
title: FieldGroupFieldBindingsOf
---

# Type Alias: FieldGroupFieldBindingsOf\<TGroup, TData\>

```ts
type FieldGroupFieldBindingsOf<TGroup, TData> = FieldGroupFieldsOf<TGroup> extends FieldGroupFields ? FieldGroupFieldBindings<FieldGroupFieldsOf<TGroup>, TData> : never;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:55](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L55)

## Type Parameters

### TGroup

`TGroup`

### TData

`TData`
