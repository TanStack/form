---
id: FieldGroupFieldSlotValue
title: FieldGroupFieldSlotValue
---

# Type Alias: FieldGroupFieldSlotValue\<TSlot\>

```ts
type FieldGroupFieldSlotValue<TSlot> = TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L67)

Extracts the value type declared by a field-group slot.

## Type Parameters

### TSlot

`TSlot`

The slot whose declared value type is extracted.
