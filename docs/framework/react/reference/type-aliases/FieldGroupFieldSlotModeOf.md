---
id: FieldGroupFieldSlotModeOf
title: FieldGroupFieldSlotModeOf
---

# Type Alias: FieldGroupFieldSlotModeOf\<TSlot\>

```ts
type FieldGroupFieldSlotModeOf<TSlot> = TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:44](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L44)

## Type Parameters

### TSlot

`TSlot`
