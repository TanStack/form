---
id: fieldApi
title: Field API
---

### Creating a new FieldApi Instance

Normally, you will not need to create a new `FieldApi` instance directly. Instead, you will use a framework hook/function like `useField` or `createField` to create a new instance for you that utilizes your frameworks reactivity model. However, if you need to create a new instance manually, you can do so by calling the `new FieldApi` constructor.

```tsx
const fieldApi: FieldApi<TData> = new FieldApi(formOptions: Field Options<TData>)
```

### `FieldOptions<TData, TParentData>`

An object type representing the options for a field in a form.

- ```tsx
  name
  ```
  - The field name. If `TParentData` is `unknown`, the type will be `string`. Otherwise, it will be `DeepKeys<TParentData>`.
- ```tsx
  defaultValue?: TData
  ```
  - An optional default value for the field.
- ```tsx
  defaultMeta?: Partial<FieldMeta>
  ```

  - An optional object with default metadata for the field.

- ```tsx
  onMount?: (formApi: FieldApi<TData, TParentData>) => void
  ```

  - An optional function that takes a param of `formApi` which is a generic type of `TData` and `TParentData`

- ```tsx
   onChange?: ValidateFn<TData, TParentData>
  ```

  - An optional property that takes a `ValidateFn` which is a generic of `TData` and `TParentData`

- ```tsx
    onChangeAsync?: ValidateAsyncFn<TData, TParentData>
  ```

  - An optional property similar to `onChange` but async validation

- ```tsx
     onChangeAsyncDebounceMs?: number
  ```

  - An optional number to represent how long the `onChangeAsync` should wait before running
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

- ```tsx
    onBlur?: ValidateFn<TData, TParentData>
  ```

  - An optional function, when that run when subscribing to blur event of input

- ```tsx
   onBlurAsync?: ValidateAsyncFn<TData, TParentData>
  ```

  - An optional function that takes a `ValidateFn` which is a generic of `TData` and `TParentData` happens async

  ```tsx
  onBlurAsyncDebounceMs?: number
  ```

  - An optional number to represent how long the `onBlurAsyncDebounceMs` should wait before running
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

  ```tsx
  onSubmitAsync?: number
  ```

  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

### `ValidationCause`

A type representing the cause of a validation event.

- 'change' | 'blur' | 'submit' | 'mount'

### `FieldMeta`

An object type representing the metadata of a field in a form.

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

### `FieldApi<TData, TParentData>`

A class representing the API for managing a form field.

#### Properties

- ```tsx
  uid: number
  ```
  - A unique identifier for the field instance.
- ```tsx
  form: FormApi<TParentData>
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
  updateStore(): void
  ```
  - Updates the field store with the latest form state.
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
  - Sets the field value.
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
  getSubField<TName extends DeepKeys<TData>>(name: TName): FieldApi<DeepValue<TData, TName>, TParentData>
  ```
  - Gets a subfield instance.
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

### `UserChangeProps<TData>`

An object type representing the change and blur event handlers for a field.

- ```tsx
  onChange?: (value: TData) => void
  ```
  - An optional function to further handle the change event.
- ```tsx
  onBlur?: (event: any) => void
  ```
  - An optional function to further handle the blur event.

### `UserInputProps`

An object type representing the input event handlers for a field.

- ```tsx
  onChange?: (event: any) => void
  ```
  - An optional function to further handle the change event.
- ```tsx
  onBlur?: (event: any) => void
  ```
  - An optional function to further handle the blur event.

### `ChangeProps<TData>`

An object type representing the change and blur event handlers for a field.

- ```tsx
  value: TData
  ```
  - The current value of the field.
- ```tsx
  onChange: (value: TData) => void
  ```
  - A function to handle the change event.
- ```tsx
  onBlur: (event: any) => void
  ```
  - A function to handle the blur event.

### `InputProps`

An object type representing the input event handlers for a field.

- ```tsx
  value: string
  ```
  - The current value of the field, coerced to a string.
- ```tsx
  onChange: (event: any) => void
  ```
  - A function to handle the change event.
- ```tsx
  onBlur: (event: any) => void
  ```
  - A function to handle the blur event.
