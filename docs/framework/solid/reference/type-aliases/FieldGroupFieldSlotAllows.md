---
id: FieldGroupFieldSlotAllows
title: FieldGroupFieldSlotAllows
---

# Type Alias: FieldGroupFieldSlotAllows\<TSlot, TValue\>

```ts
type FieldGroupFieldSlotAllows<TSlot, TValue> = TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode> ? TMode extends "strict" ? IsSame<TValue, TAcceptedValue> : [TValue] extends [TAcceptedValue] ? true : false : false;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:43](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L43)

## Type Parameters

### TSlot

`TSlot`

### TValue

`TValue`
