---
id: FieldMetaBase
title: FieldMetaBase
---

# Type Alias: FieldMetaBase

```ts
type FieldMetaBase = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:413](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L413)

## Type declaration

### errorMap

```ts
errorMap: ValidationErrorMap;
```

A map of errors related to the field value.

### isBlurred

```ts
isBlurred: boolean;
```

A flag indicating whether the field has been blurred.

### isDirty

```ts
isDirty: boolean;
```

A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.

### isTouched

```ts
isTouched: boolean;
```

A flag indicating whether the field has been touched.

### isValidating

```ts
isValidating: boolean;
```

A flag indicating whether the field is currently being validated.
