---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:83](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L83)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
