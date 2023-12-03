---
id: formApi
title: Form API
---

### Creating a new FormApi Instance



Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework hook/function like `useForm` or `createForm` to create a new instance for you that utilizes your frameworks reactivity model. However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

```tsx
const formApi: FormApi<TData> = new FormApi(formOptions: FormOptions<TData>)
```

### `FormOptions<TData, ValidatorType>`

An object representing the options for a form.

- ```tsx
    defaultValues?: TData
  ```
  - Set initial values for your form.
- ```tsx
    defaultState?: Partial<FormState<TData>>
  ```
  - The default state for the form.

- ```tsx
    asyncDebounceMs?: number
  ```
  -  Optional time in milliseconds if you want to introduce a delay before firing off an async action.

- ```tsx
  onMount?: (values: TData, formApi: FormApi<TData>) => ValidationError
  ```
  -  Optional function that fires as soon as the component mounts.
- ```tsx
    onMountAsync?: ( values: TData, formApi: FormApi<TData>) => ValidationError | Promise<ValidationError>
  ```
  -  Optional async function that fires when the component mounts
- ```tsx
    onMountAsyncDebounceMs?: number
  ```
  - The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

- ```tsx
     onChange?: (values: TData, formApi: FormApi<TData>) => ValidationError
  ```
  -  Optional function that checks the validity of your data whenever a value changes

- ```tsx
    onChangeAsync?: (values: TData, formApi: FormApi<TData>) => ValidationError | Promise<ValidationError>
  ```
  -  Optional onChange  asynchronous counterpart to onChange. Useful for more complex validation logic that might involve server requests.

- ```tsx
    onChangeAsyncDebounceMs?: number
  ```
  - The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

- ```tsx
    onBlur?: (values: TData, formApi: FormApi<TData>) => ValidationError
  ```
  -  Optional  function that validates the form data when a field loses focus, returns a `ValidationError`

- ```tsx
    onBlurAsync?:  (values: TData,formApi: FormApi<TData>) => ValidationError | Promise<ValidationError>
  ```
  -  Optional onBlur asynchronous validation method for when a field loses focus return a `ValidationError`  or a promise of `Promise<ValidationError>`

- ```tsx
    onBlurAsyncDebounceMs?: number
  ```
  - The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

- ```tsx
  onSubmit?: (values: TData, formApi: FormApi<TData>) => any | Promise<any>
  ```
  - A function to be called when the form is submitted, what should happen once the user submits a valid form  returns `any` or a promise `Promise<any>`

- ```tsx
    onSubmitInvalid?: (values: TData, formApi: FormApi<TData>) => void
  ```
  - Specify an action for scenarios where the user tries to submit an invalid form.


### `FormApi<TFormData, ValidatorType>`

A class representing the Form API. It handles the logic and interactions with the form state.

#### Properties

- ```tsx
  options: FormOptions<TFormData> = {}
  ```
  - The options for the form.
- ```tsx
  store: Store<FormState<TFormData>>
  ```
  - A [TanStack Store instance](https://tanstack.com/store/latest/docs/reference/Store) that keeps track of the form's state.
- ```tsx
  state: FormState<TFormData>
  ```
  - The current state of the form.
- ```tsx
  fieldInfo: Record<DeepKeys<TFormData>, FieldInfo<TFormData>> ={} as any
  ```
  - A record of field information for each field in the form.
- ```tsx
    fieldName?: string
  ```
  - An optional string representing the name of the field.
- ```tsx
  validationMeta: ValidationMeta
  ```
  - The validation metadata for the form.

#### Methods

- ```tsx
    constructor(opts?: FormOptions<TFormData>)
  ```
  - Constructs a new `FormApi` instance with the given form options.
- ```tsx
    update(options: FormOptions<TFormData>)
  ```
  - Updates the form options and form state.
- ```tsx
  reset()
  ```
  - Resets the form state to the default values.
- ```tsx
  validateAllFields()
  ```
  - Validates all fields in the form.

- ```tsx
    handleSubmit()
  ```
  - Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.
- ```tsx
    getFieldValue<TField extends DeepKeys<TFormData>>(field: TField)
  ```
  - Gets the value of the specified field.
- ```tsx
    getFieldMeta<TField extends DeepKeys<TFormData>>(field: TField)
  ```
  - Gets the metadata of the specified field.
- ```tsx
    getFieldInfo<TField extends DeepKeys<TFormData>>(field: TField)
  ```
  - Gets the field info of the specified field.
- ```tsx
    setFieldMeta<TField extends DeepKeys<TFormData>>(field: TField, updater: Updater<FieldMeta>)
  ```
  - Updates the metadata of the specified field.
- ```tsx
    setFieldValue<TField extends DeepKeys<TFormData>>(field: TField, updater: Updater<DeepValue<TFormData, TField>>, opts?: { touch?: boolean })
  ```
  - Sets the value of the specified field and optionally updates the touched state.
- ```tsx
    pushFieldValue<TField extends DeepKeys<TFormData>>(field: TField, value: DeepValue<TFormData, TField>, opts?: { touch?: boolean })
  ```
  - Pushes a value into an array field.
- ```tsx
    insertFieldValue<TField extends DeepKeys<TFormData>>(field: TField, index: number, value: DeepValue<TFormData, TField>, opts?: { touch?: boolean })
  ```
  - Inserts a value into an array field at the specified index.
- ```tsx
    removeFieldValue<TField extends DeepKeys<TFormData>>(field: TField, index: number, opts?: { touch?: boolean })
  ```
  - Removes a value from an array field at the specified index.
- ```tsx
    swapFieldValues<TField extends DeepKeys<TFormData>>(field: TField, index1: number, index2: number)
  ```
  - Swaps the values at the specified indices within an array field.

### `FormState<TData>`

An object representing the current state of the form.

- ```tsx
  values: TData
  ```
  - The current values of the form fields.
- ```tsx
  isFormValidating: boolean
  ```
  - A boolean indicating if the form is currently validating.
- ```tsx
  formValidationCount: number
  ```
  - A counter for tracking the number of validations performed on the form.
- ```tsx
  isFormValid: boolean
  ```
  - A boolean indicating if the form is valid.
- ```tsx
    formError?: ValidationError
  ```
  - A possible validation error for the form.
- ```tsx
  fieldMeta: Record<DeepKeys<TData>, FieldMeta>
  ```
  - A record of field metadata for each field in the form.
- ```tsx
  isFieldsValidating: boolean
  ```
  - A boolean indicating if any of the form fields are currently validating.
- ```tsx
  isFieldsValid: boolean
  ```
  - A boolean indicating if all the form fields are valid.
- ```tsx
  isSubmitting: boolean
  ```
  - A boolean indicating if the form is currently submitting.
- ```tsx
  isTouched: boolean
  ```
  - A boolean indicating if any of the form fields have been touched.
- ```tsx
  isSubmitted: boolean
  ```
  - A boolean indicating if the form has been submitted.
- ```tsx
  isValidating: boolean
  ```
  - A boolean indicating if the form or any of its fields are currently validating.
- ```tsx
  isValid: boolean
  ```
  - A boolean indicating if the form and all its fields are valid.
- ```tsx
  canSubmit: boolean
  ```
  - A boolean indicating if the form can be submitted based on its current state.
- ```tsx
  submissionAttempts: number
  ```
  - A counter for tracking the number of submission attempts.

### `FieldInfo<TFormData>`

An object representing the field information for a specific field within the form.

- ```tsx
  instances: Record<string, FieldApi<any, TFormData>>
  ```
  - A record of field instances with unique identifiers as keys.
  - Check below for `ValidationMeta`



### `ValidationMeta`

An object representing the validation metadata for a field.

- ```tsx
    validationCount?: number
  ```
  - A counter for tracking the number of validations performed on the field.

- ```tsx
    validationAsyncCount?: number
  ```
  - A counter for tracking the number of validations performed on the field async.
- ```tsx
    validationPromise?: Promise<ValidationError>
  ```
  - A promise representing the current validation state of the field.
- ```tsx
    validationResolve?: (error: ValidationError) => void
  ```
  - A function to resolve the validation promise with a possible validation error.
- ```tsx
    validationReject?: (error: unknown) => void
  ```
  - A function to reject the validation promise with an error.

### `ValidationError`

A type representing a validation error. Possible values are `undefined`, `false`, `null`, or a `string` with an error message.

### `ValidationErrorMapKeys`
A type representing the keys used to map to `ValidationError` in `ValidationErrorMap`. It is defined with `on${Capitalize<ValidationCause>}`


### `ValidationErrorMap`

A type that represents a map with the keys as `ValidationErrorMapKeys` and the values as `ValidationError`
