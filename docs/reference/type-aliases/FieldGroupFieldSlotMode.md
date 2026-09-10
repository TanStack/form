---
id: FieldGroupFieldSlotMode
title: FieldGroupFieldSlotMode
---

# Type Alias: FieldGroupFieldSlotMode

```ts
type FieldGroupFieldSlotMode = "strict" | "loose";
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:12](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L12)

Controls how a virtual field's value type is matched to concrete form field
paths.

`strict` requires an exact type match. `loose` also accepts narrower value
types that are assignable to the virtual field's declared type.
