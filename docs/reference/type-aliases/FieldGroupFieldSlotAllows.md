---
id: FieldGroupFieldSlotAllows
title: FieldGroupFieldSlotAllows
---

# Type Alias: FieldGroupFieldSlotAllows\<TSlot, TValue\>

```ts
type FieldGroupFieldSlotAllows<TSlot, TValue> = TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode> ? TMode extends "strict" ? IsSame<TValue, TAcceptedValue> : [TValue] extends [TAcceptedValue] ? true : false : false;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:94](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L94)

Reports whether a concrete field value type satisfies a field-group slot's
matching rule.

Strict slots require the two value types to be identical. Loose slots accept
a concrete value type that is assignable to the slot's declared value type.

## Type Parameters

### TSlot

`TSlot`

The virtual field slot that supplies the matching rule.

### TValue

`TValue`

The concrete form field value type to test.
