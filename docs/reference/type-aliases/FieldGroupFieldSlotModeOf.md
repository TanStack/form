---
id: FieldGroupFieldSlotModeOf
title: FieldGroupFieldSlotModeOf
---

# Type Alias: FieldGroupFieldSlotModeOf\<TSlot\>

```ts
type FieldGroupFieldSlotModeOf<TSlot> = TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:75](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L75)

Extracts whether a field-group slot uses strict or loose matching.

## Type Parameters

### TSlot

`TSlot`

The slot whose matching mode is extracted.
