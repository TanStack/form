# Type alias: FieldMeta

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

### touchedErrors

```ts
touchedErrors: ValidationError[];
```

An array of errors related to the touched state of the field.

## Source

[packages/form-core/src/FieldApi.ts:331](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/FieldApi.ts#L331)
