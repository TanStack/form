---
id: FieldMeta
title: FieldMeta
---

# Type Alias: FieldMeta

```ts
type FieldMeta: object;
```

An object type representing the metadata of a field in a form.

## Type declaration

### errorMap

```ts
errorMap: ValidationErrorMap;
```

A map of errors related to the field value.

### errors

```ts
errors: ValidationError[];
```

An array of errors related to the field value.

### isDirty

```ts
isDirty: boolean;
```

A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.

### isPristine

```ts
isPristine: boolean;
```

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.

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

## Defined in

[packages/form-core/src/FieldApi.ts:333](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FieldApi.ts#L333)
