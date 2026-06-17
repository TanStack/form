---
id: FieldGroupFieldSlotValue
title: FieldGroupFieldSlotValue
---

# Type Alias: FieldGroupFieldSlotValue\<TSlot\>

```ts
type FieldGroupFieldSlotValue<TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:42](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L42)

## Type Parameters

### TSlot

`TSlot`
