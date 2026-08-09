---
id: FieldGroupFieldSlotModeOf
title: FieldGroupFieldSlotModeOf
---

# Type Alias: FieldGroupFieldSlotModeOf\<TSlot\>

```ts
type FieldGroupFieldSlotModeOf<TSlot> = TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:38](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L38)

## Type Parameters

### TSlot

`TSlot`
