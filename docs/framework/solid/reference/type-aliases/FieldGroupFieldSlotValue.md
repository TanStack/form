---
id: FieldGroupFieldSlotValue
title: FieldGroupFieldSlotValue
---

# Type Alias: FieldGroupFieldSlotValue\<TSlot\>

```ts
type FieldGroupFieldSlotValue<TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:32](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L32)

## Type Parameters

### TSlot

`TSlot`
