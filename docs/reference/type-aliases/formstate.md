---
id: FormState
title: FormState
---

# Type Alias: FormState\<TFormData\>

```ts
type FormState<TFormData>: object;
```

An object representing the current state of the form.

## Type Parameters

• **TFormData**

## Type declaration

### canSubmit

```ts
canSubmit: boolean;
```

A boolean indicating if the form can be submitted based on its current state.

### errorMap

```ts
errorMap: ValidationErrorMap;
```

The error map for the form itself.

### errors

```ts
errors: ValidationError[];
```

The error array for the form itself.

### fieldMeta

```ts
fieldMeta: Record<DeepKeys<TFormData>, FieldMeta>;
```

A record of field metadata for each field in the form.

### isDirty

```ts
isDirty: boolean;
```

A boolean indicating if any of the form's fields' values have been modified by the user. `True` if the user have modified at least one of the fields. Opposite of `isPristine`.

### isFieldsValid

```ts
isFieldsValid: boolean;
```

A boolean indicating if all the form fields are valid.

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

A boolean indicating if any of the form fields are currently validating.

### isFormValid

```ts
isFormValid: boolean;
```

A boolean indicating if the form is valid.

### isFormValidating

```ts
isFormValidating: boolean;
```

A boolean indicating if the form is currently validating.

### isPristine

```ts
isPristine: boolean;
```

A boolean indicating if none of the form's fields' values have been modified by the user. `True` if the user have not modified any of the fields. Opposite of `isDirty`.

### isSubmitted

```ts
isSubmitted: boolean;
```

A boolean indicating if the form has been submitted.

### isSubmitting

```ts
isSubmitting: boolean;
```

A boolean indicating if the form is currently submitting.

### isTouched

```ts
isTouched: boolean;
```

A boolean indicating if any of the form fields have been touched.

### isValid

```ts
isValid: boolean;
```

A boolean indicating if the form and all its fields are valid.

### isValidating

```ts
isValidating: boolean;
```

A boolean indicating if the form or any of its fields are currently validating.

### submissionAttempts

```ts
submissionAttempts: number;
```

A counter for tracking the number of submission attempts.

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

An internal mechanism used for keeping track of validation logic in a form.

### values

```ts
values: TFormData;
```

The current values of the form fields.

## Defined in

[packages/form-core/src/FormApi.ts:200](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/form-core/src/FormApi.ts#L200)
