---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L87)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
