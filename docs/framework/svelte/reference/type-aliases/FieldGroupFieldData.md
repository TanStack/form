---
id: FieldGroupFieldData
title: FieldGroupFieldData
---

# Type Alias: FieldGroupFieldData\<TFields\>

```ts
type FieldGroupFieldData<TFields> = { [TName in keyof TFields]: TFields[TName] extends FieldGroupFieldSlot<infer TValue, any> ? TValue : never };
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:71](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L71)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)
