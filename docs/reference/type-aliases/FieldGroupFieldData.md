---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TFieldName in keyof TFields]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:149](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L149)

Converts a virtual field schema into the value shape exposed by its field
group API.

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

The virtual field schema whose value types are
extracted.
