---
id: FieldGroupFieldSlotModeOf
title: FieldGroupFieldSlotModeOf
---

# Type Alias: FieldGroupFieldSlotModeOf\<TSlot\>

```ts
type FieldGroupFieldSlotModeOf<TSlot> = TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:45](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L45)

## Type Parameters

### TSlot

`TSlot`
