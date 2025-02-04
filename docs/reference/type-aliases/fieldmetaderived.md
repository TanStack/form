---
id: FieldMetaDerived
title: FieldMetaDerived
---

# Type Alias: FieldMetaDerived

```ts
type FieldMetaDerived = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:436](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L436)

## Type declaration

### errors

```ts
errors: ValidationError[];
```

An array of errors related to the field value.

### isPristine

```ts
isPristine: boolean;
```

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.
