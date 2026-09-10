---
id: StrictFieldGroupFieldSlot
title: StrictFieldGroupFieldSlot
---

# Type Alias: StrictFieldGroupFieldSlot\<TValue\>

```ts
type StrictFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<TValue, "strict">;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:45](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L45)

A virtual field slot that binds only to form fields with exactly `TValue`.

## Type Parameters

### TValue

`TValue`

The value type the concrete form field must match.
