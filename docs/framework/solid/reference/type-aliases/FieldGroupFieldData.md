---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:74](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L74)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
