---
id: fieldApi
title: Field API
---

### Creating a new FieldApi Instance

Normally, you will not need to create a new `FieldApi` instance directly. Instead, you will use a framework hook/function like `useField` or `createField` to create a new instance for you that utilizes your frameworks reactivity model. However, if you need to create a new instance manually, you can do so by calling the `new FieldApi` constructor.

```tsx
const fieldApi: FieldApi<TData> = new FieldApi(formOptions: Field Options<TData>)
```

### `FieldOptions<TData, TFormData>`

An object type representing the options for a field in a form.

- `name`
  - The field name. If `TFormData` is `unknown`, the type will be `string`. Otherwise, it will be `DeepKeys<TFormData>`.
- `defaultValue?: TData`
  - An optional default value for the field.
- `form?: FormApi<TFormData>`
  - An optional reference to the form API instance.
- `validate?: (value: TData, fieldApi: FieldApi<TData, TFormData>) => ValidationError | Promise<ValidationError>`
  - An optional validation function for the field.
- `validatePristine?: boolean`
  - An optional flag indicating whether to validate the field when it is pristine (untouched).
- `defaultMeta?: Partial<FieldMeta>`
  - An optional object with default metadata for the field.
- `validateOn?: ValidationCause`
  - An optional string indicating when to perform field validation.
- `validateAsyncOn?: ValidationCause`
  - An optional string indicating when to perform async field validation.
- `validateAsyncDebounceMs?: number`
  - If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

### `ValidationCause`

A type representing the cause of a validation event.

- 'change' | 'blur' | 'submit'

### `FieldMeta`

An object type representing the metadata of a field in a form.

- `isTouched: boolean`
  - A flag indicating whether the field has been touched.
- `touchedError?: ValidationError`
  - An optional error related to the touched state of the field.
- `error?: ValidationError`
  - An optional error related to the field value.
- `isValidating: boolean`
  - A flag indicating whether the field is currently being validated.

### `FieldApiOptions<TData, TFormData>`

An object type representing the required options for the `FieldApi` class.

- Inherits from `FieldOptions<TData, TFormData>` with the `form` property set as required.

### `FieldApi<TData, TFormData>`

A class representing the API for managing a form field.

#### Properties

- `uid: number`
  - A unique identifier for the field instance.
- `form: FormApi<TFormData>`
  - A reference to the form API instance.
- `name: DeepKeys<TFormData>`
  - The field name.
- `store: Store<FieldState<TData>>`
  - The field state store.
- `state: FieldState<TData>`
  - The current field state.
- `options: RequiredByKey<FieldOptions<TData, TFormData>, 'validateOn'>`
  - The field options with the `validateOn` property set as required.

#### Methods

- `constructor(opts: FieldApiOptions<TData, TFormData>)`
  - Initializes a new `FieldApi` instance.
- `mount(): () => void`
  - Mounts the field instance to the form.
- `updateStore(): void`
  - Updates the field store with the latest form state.
- `update(opts: FieldApiOptions<TData, TFormData>): void`
  - Updates the field instance with new options.
- `getValue(): TData`
  - Gets the current field value.
- `setValue(updater: Updater<TData>, options?: { touch?: boolean; notify?: boolean }): void`
  - Sets the field value.
- `getMeta(): FieldMeta`
  - Gets the current field metadata.
- `setMeta(updater: Updater<FieldMeta>): void`
  - Sets the field metadata.
- `getInfo(): any`
  - Gets the field information object.
- `pushValue(value: TData): void`
  - Pushes a new value to the field.
- `insertValue(index: number, value: TData): void`
  - Inserts a value at the specified index.
- `removeValue(index: number): void`
  - Removes a value at the specified index.
- `swapValues(aIndex: number, bIndex: number): void`
  - Swaps the values at the specified indices.
- `getSubField<TName extends DeepKeys<TData>>(name: TName): FieldApi<DeepValue<TData, TName>, TFormData>`
  - Gets a subfield instance.
- `validate(): Promise<any>`
  - Validates the field value.
- `getChangeProps<T extends ChangeProps<any>>(props: T = {} as T): ChangeProps<TData> & Omit<T, keyof ChangeProps<TData>>`
  - Gets the change and blur event handlers.
- `getInputProps<T extends InputProps>(props: T = {} as T): InputProps & Omit<T, keyof InputProps>`
  - Gets the input event handlers.

### `FieldState<TData>`

An object type representing the state of a field.

- `value: TData`
  - The current value of the field.
- `meta: FieldMeta`
  - The current metadata of the field.

### `ChangeProps<TData>`

An object type representing the change and blur event handlers for a field.

- `value: TData`
  - The current value of the field.
- `onChange: (updater: Updater<TData>) => void`
  - A function to handle the change event.
- `onBlur: (event: any) => void`
  - A function to handle the blur event.

### `InputProps`

An object type representing the input event handlers for a field.

- `value: string`
  - The current value of the field, coerced to a string.
- `onChange: (event: any) => void`
  - A function to handle the change event.
- `onBlur: (event: any) => void`
  - A function to handle the blur event.
