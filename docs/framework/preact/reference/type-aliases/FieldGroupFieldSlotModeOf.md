---
id: FieldGroupFieldSlotModeOf
title: FieldGroupFieldSlotModeOf
---

# Type Alias: FieldGroupFieldSlotModeOf\<TSlot\>

```ts
type FieldGroupFieldSlotModeOf<TSlot> = TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:41](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L41)

## Type Parameters

### TSlot

`TSlot`
