---
id: fieldApi
title: Field API
---

### Creating a new FieldApi Instance

Normally, you will not need to create a new `FieldApi` instance directly. Instead, you will use a framework hook/function like `useField` or `createField` to create a new instance for you that utilizes your frameworks reactivity model. However, if you need to create a new instance manually, you can do so by calling the `new FieldApi` constructor.

```tsx
const fieldApi: FieldApi<TData> = new FieldApi(formOptions: FieldOptions<TData>)
```

### `FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>`

An object type representing the options for a field in a form.

- ```tsx
  name: TName
  ```

  - The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

- ```tsx
  defaultValue?: TData
  ```

  - An optional default value for the field.

- ```tsx
  defaultMeta?: Partial<FieldMeta>
  ```

  - An optional object with default metadata for the field.

- ```tsx
  asyncDebounceMs?: number
  ```

  - The default time to debounce async validation if there is not a more specific debounce time passed.

- ```tsx
  asyncAlways?: boolean
  ```

  - If `true`, always run async validation, even if there are errors emitted during synchronous validation.

- ```typescript
  validatorAdapter?: ValidatorType
  ```

  - A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

- ```tsx
  validators?: FieldValidators<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
  >
  ```
  - A list of validators to pass to the field

### `FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>`

- ```tsx
  onMount?: (formApi: FieldApi<TData, TParentData>) => void
  ```

  - An optional function that takes a param of `formApi` which is a generic type of `TData` and `TParentData`

- ```tsx
  onChange?: ValidateFn<TData, TParentData>
  ```

  - An optional property that takes a `ValidateFn` which is a generic of `TData` and `TParentData`. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().min(1)` if `zodAdapter` is passed)

- ```tsx
  onChangeAsync?: ValidateAsyncFn<TData, TParentData>
  ```

  - An optional property similar to `onChange` but async validation. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed)

- ```tsx
  onChangeAsyncDebounceMs?: number
  ```

  - An optional number to represent how long the `onChangeAsync` should wait before running
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

- ```tsx
  onChangeListenTo?: DeepKeys<TParentData>[]
  ```

  - An optional list of field names that should trigger **this** field's `onChange` and `onChangeAsync` events when **its** value changes

- ```tsx
  onBlur?: ValidateFn<TData, TParentData>
  ```

  - An optional function, when that run when subscribing to blur event of input. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().min(1)` if `zodAdapter` is passed)

- ```tsx
  onBlurAsync?: ValidateAsyncFn<TData, TParentData>
  ```

  - An optional function that takes a `ValidateFn` which is a generic of `TData` and `TParentData` happens async. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed)

  ```tsx
  onBlurAsyncDebounceMs?: number
  ```

  - An optional number to represent how long the `onBlurAsyncDebounceMs` should wait before running
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

- ```tsx
  onBlurListenTo?: DeepKeys<TParentData>[]
  ```

  - An optional list of field names that should trigger **this** field's `onBlur` and `onBlurAsync` events when **its** field blurs

- ```tsx
  onSubmit?: ValidateFn<TData, TParentData>
  ```

  - An optional function, when that run when subscribing to submit event of input. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().min(1)` if `zodAdapter` is passed)

- ```tsx
  onSubmitAsync?: ValidateAsyncFn<TData, TParentData>
  ```

  - An optional function that takes a `ValidateFn` which is a generic of `TData` and `TParentData` happens async. If `validator` is passed, this may also accept a property from the respective validator (IE: `z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed)

  ```tsx
  onSubmitAsyncDebounceMs?: number
  ```

  - An optional number to represent how long the `onSubmitAsyncDebounceMs` should wait before running
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

### `FieldMeta`

An object type representing the metadata of a field in a form.

- ```tsx
  isPristine: boolean
  ```
  - A flag that is `true` if the field's value have not been modified by the user. Opposite of `isDirty`.
- ```tsx
  isDirty: boolean
  ```
  - A flag that is `true` if the field's value have been modified by the user. Opposite of `isPristine`.
- ```tsx
  isTouched: boolean
  ```
  - A flag indicating whether the field has been touched.
- ```tsx
  touchedErrors: ValidationError[]
  ```
  - An array of errors related to the touched state of the field.
- ```tsx
  errors: ValidationError[]
  ```
  - An array of errors related related to the field value.
- ```tsx
  errorMap: ValidationErrorMap
  ```
  - A map of errors related related to the field value.
- ```tsx
  isValidating: boolean
  ```
  - A flag indicating whether the field is currently being validated.

### `FieldApiOptions<TData, TParentData>`

An object type representing the required options for the `FieldApi` class.

- Inherits from `FieldOptions<TData, TParentData>` with the `form` property set as required.

### `FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>`

A class representing the API for managing a form field.

#### Properties

- ```tsx
  form: FormApi<TParentData, TData>
  ```
  - A reference to the form API instance.
- ```tsx
  name: DeepKeys<TParentData>
  ```
  - The field name.
- ```tsx
  store: Store<FieldState<TData>>
  ```
  - The field state store.
- ```tsx
  state: FieldState<TData>
  ```
  - The current field state.
- ```tsx
  options: RequiredByKey<FieldOptions<TData, TParentData>, 'validateOn'>
  ```
  - The field options with the `validateOn` property set as required.

#### Methods

- ```tsx
  constructor(opts: FieldApiOptions<TData, TParentData>)
  ```

  - Initializes a new `FieldApi` instance.

- ```tsx
  mount(): () => void
  ```

  - Mounts the field instance to the form.

- ```tsx
  update(opts: FieldApiOptions<TData, TParentData>): void
  ```

  - Updates the field instance with new options.

- ```tsx
  getValue(): TData
  ```

  - Gets the current field value.

- ```tsx
  setValue(updater: Updater<TData>, options?: { touch?: boolean; notify?: boolean }): void
  ```

  - Sets the field value and run the `change` validator.

- ```tsx
  getMeta(): FieldMeta
  ```

  - Gets the current field metadata.

- ```tsx
  setMeta(updater: Updater<FieldMeta>): void
  ```

  - Sets the field metadata.

- ```tsx
  getInfo(): any
  ```

  - Gets the field information object.

- ```tsx
  pushValue(value: TData): void
  ```

  - Pushes a new value to the field.

- ```tsx
  insertValue(index: number, value: TData): void
  ```

  - Inserts a value at the specified index.

- ```tsx
  removeValue(index: number): void
  ```

  - Removes a value at the specified index.

- ```tsx
  swapValues(aIndex: number, bIndex: number): void
  ```

  - Swaps the values at the specified indices.

- ```tsx
  validate(): Promise<any>
  ```

  - Validates the field value.

- ```tsx
  handleBlur(): void;
  ```

  - Handles the blur event.

- ```tsx
  handleChange(value: TData): void
  ```
  - Handles the change event.

### `FieldState<TData>`

An object type representing the state of a field.

- ```tsx
  value: TData
  ```
  - The current value of the field.
- ```tsx
  meta: FieldMeta
  ```
  - The current metadata of the field.
