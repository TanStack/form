---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [with-fields.ts:68](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/with-fields.ts#L68)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`
