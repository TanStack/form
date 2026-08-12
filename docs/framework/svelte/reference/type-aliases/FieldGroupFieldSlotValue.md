---
id: FieldGroupFieldSlotValue
title: FieldGroupFieldSlotValue
---

# Type Alias: FieldGroupFieldSlotValue\<TSlot\>

```ts
type FieldGroupFieldSlotValue<TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:39](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L39)

## Type Parameters

### TSlot

`TSlot`
