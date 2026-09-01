---
id: LooseFieldGroupFieldSlot
title: LooseFieldGroupFieldSlot
---

# Type Alias: LooseFieldGroupFieldSlot\<TValue\>

```ts
type LooseFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<TValue, "loose">;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:57](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L57)

A virtual field slot that binds to form fields whose value type is
assignable to `TValue`.

## Type Parameters

### TValue

`TValue`

The value type that compatible concrete field values
must be assignable to.
