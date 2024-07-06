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

## Source

[packages/form-core/src/FieldApi.ts:330](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L330)
