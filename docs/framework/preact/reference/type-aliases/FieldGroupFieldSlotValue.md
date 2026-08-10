---
id: FieldGroupFieldSlotValue
title: FieldGroupFieldSlotValue
---

# Type Alias: FieldGroupFieldSlotValue\<TSlot\>

```ts
type FieldGroupFieldSlotValue<TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:38](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L38)

## Type Parameters

### TSlot

`TSlot`
