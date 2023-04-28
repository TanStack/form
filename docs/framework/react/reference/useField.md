---
id: useField
title: useField
---

### `UseField<TFormData>`

A type representing a hook for using a field in a form with the given form data type.

```tsx
export type UseField = <TField extends DeepKeys<TFormData>>(
  opts?: { name: TField } & FieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>
```

- A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.

### `useField`

```tsx
export function useField<TData, TFormData>(
  opts: FieldOptions<TData, TFormData>,
): FieldApi<TData, TFormData>
```

A hook for managing a field in a form.

- ```tsx
  opts: FieldOptions<TData, TFormData>
  ```
  - An object with field options.

#### Returns

- ```tsx
  FieldApi<TData, TFormData>
  ```
  - The `FieldApi` instance for the specified field.

### `createUseField`

```tsx
export function createUseField<TFormData>(
  formApi: FormApi<TFormData>,
): UseField<TFormData>
```

A function that creates a `UseField` hook bound to the given `formApi`.
