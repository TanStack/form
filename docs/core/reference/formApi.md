---
id: formApi
title: Form API
---

### Creating a new FormApi Instance

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework hook/function like `useForm` or `createForm` to create a new instance for you that utilizes your frameworks reactivity model. However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

```tsx
const formApi: FormApi<TData> = new FormApi(formOptions: FormOptions<TData>)
```

### `FormOptions<TData>`

An object representing the options for a form.

- `defaultValues?: TData`
  - The default values for the form fields.
- `defaultState?: Partial<FormState<TData>>`
  - The default state for the form.
- `onSubmit?: (values: TData, formApi: FormApi<TData>) => Promise<any>`
  - A function to be called when the form is submitted and valid.
- `onInvalidSubmit?: (values: TData, formApi: FormApi<TData>) => void`
  - A function to be called when the form is submitted but invalid.
- `validate?: (values: TData, formApi: FormApi<TData>) => Promise<any>`
  - A function for custom validation logic for the form.
- `debugForm?: boolean`
  - A boolean flag to enable or disable form debugging.
- `validatePristine?: boolean`
  - A boolean flag to enable or disable validation for pristine fields.

### `FormApi<TFormData>`

A class representing the Form API. It handles the logic and interactions with the form state.

#### Properties

- `options: FormOptions<TFormData>`
  - The options for the form.
- `store: Store<FormState<TFormData>>`
  - The internal store for the form state.
- `state: FormState<TFormData>`
  - The current state of the form.
- `fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData>>`
  - A record of field information for each field in the form.
- `fieldName?: string`
  - An optional string representing the name of the field.
- `validationMeta: ValidationMeta`
  - The validation metadata for the form.

#### Methods

- `constructor(opts?: FormOptions<TFormData>)`
  - Constructs a new `FormApi` instance with the given form options.
- `update(options: FormOptions<TFormData>)`
  - Updates the form options and form state.
- `reset()`
  - Resets the form state to the default values.
- `validateAllFields()`
  - Validates all fields in the form.
- `validateForm()`
  - Validates the form itself.
- `handleSubmit(e: FormEvent & { __handled?: boolean })`
  - Handles the form submission event, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.
- `getFieldValue<TField extends DeepKeys<TFormData>>(field: TField)`
  - Gets the value of the specified field.
- `getFieldMeta<TField extends DeepKeys<TFormData>>(field: TField)`
  - Gets the metadata of the specified field.
- `getFieldInfo<TField extends DeepKeys<TFormData>>(field: TField)`
  - Gets the field info of the specified field.
- `setFieldMeta<TField extends DeepKeys<TFormData>>(field: TField, updater: Updater<FieldMeta>)
  - Updates the metadata of the specified field.
- `setFieldValue<TField extends DeepKeys<TFormData>>(field: TField, updater: Updater<DeepValue<TFormData, TField>>, opts?: { touch?: boolean })
  - Sets the value of the specified field and optionally updates the touched state.
- `pushFieldValue<TField extends DeepKeys<TFormData>>(field: TField, value: DeepValue<TFormData, TField>, opts?: { touch?: boolean })
  - Pushes a value into an array field.
- `insertFieldValue<TField extends DeepKeys<TFormData>>(field: TField, index: number, value: DeepValue<TFormData, TField>, opts?: { touch?: boolean })
  - Inserts a value into an array field at the specified index.
- `spliceFieldValue<TField extends DeepKeys<TFormData>>(field: TField, index: number, opts?: { touch?: boolean })
  - Removes a value from an array field at the specified index.
- `swapFieldValues<TField extends DeepKeys<TFormData>>(field: TField, index1: number, index2: number)
  - Swaps the values at the specified indices within an array field.

### `FormState<TData>`

An object representing the current state of the form.

- `values: TData`
  - The current values of the form fields.
- `isFormValidating: boolean`
  - A boolean indicating if the form is currently validating.
- `formValidationCount: number`
  - A counter for tracking the number of validations performed on the form.
- `isFormValid: boolean`
  - A boolean indicating if the form is valid.
- `formError?: ValidationError`
  - A possible validation error for the form.
- `fieldMeta: Record<DeepKeys<TData>, FieldMeta>`
  - A record of field metadata for each field in the form.
- `isFieldsValidating: boolean`
  - A boolean indicating if any of the form fields are currently validating.
- `isFieldsValid: boolean`
  - A boolean indicating if all the form fields are valid.
- `isSubmitting: boolean`
  - A boolean indicating if the form is currently submitting.
- `isTouched: boolean`
  - A boolean indicating if any of the form fields have been touched.
- `isSubmitted: boolean`
  - A boolean indicating if the form has been submitted.
- `isValidating: boolean`
  - A boolean indicating if the form or any of its fields are currently validating.
- `isValid: boolean`
  - A boolean indicating if the form and all its fields are valid.
- `canSubmit: boolean`
  - A boolean indicating if the form can be submitted based on its current state.
- `submissionAttempts: number`
  - A counter for tracking the number of submission attempts.

### `FieldInfo<TFormData>`

An object representing the field information for a specific field within the form.

- `instances: Record<string, FieldApi<any, TFormData>>`
  - A record of field instances with unique identifiers as keys.
- `validationCount?: number`
  - A counter for tracking the number of validations performed on the field.
- `validationPromise?: Promise<ValidationError>`
  - A promise representing the current validation state of the field.
- `validationResolve?: (error: ValidationError) => void`
  - A function to resolve the validation promise with a possible validation error.
- `validationReject?: (error: unknown) => void`
  - A function to reject the validation promise with an error.

### `ValidationMeta`

An object representing the validation metadata for a field.

- `validationCount?: number`
  - A counter for tracking the number of validations performed on the field.
- `validationPromise?: Promise<ValidationError>`
  - A promise representing the current validation state of the field.
- `validationResolve?: (error: ValidationError) => void`
  - A function to resolve the validation promise with a possible validation error.
- `validationReject?: (error: unknown) => void`
  - A function to reject the validation promise with an error.

### `ValidationError`

A type representing a validation error. Possible values are `undefined`, `false`, `null`, or a `string` with an error message.
