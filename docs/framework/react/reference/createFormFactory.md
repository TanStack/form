---
id: createFormFactory
title: createFormFactory
---

### `createFormFactory`

```tsx
export function createFormFactory<TFormData>(
  opts?: FormOptions<TFormData>,
): FormFactory<TFormData>
```

A function that creates a new `FormFactory<TFormData>` instance.

- `opts`
  - Optional form options and a `listen` function to be called with the form state.

### `FormFactory<TFormData>`

A type representing a form factory. Form factories provide a type-safe way to interact with the form API as opposed to using the globally exported form utilities.

```tsx
export type FormFactory<TFormData> = {
  useForm: (opts?: FormOptions<TFormData>) => FormApi<TFormData>
  useField: UseField<TFormData>
  Field: FieldComponent<TFormData>
}
```

- `useForm`
  - A custom hook that creates and returns a new instance of the `FormApi<TFormData>` class.
- `useField`
  - A custom hook that returns an instance of the `FieldApi<TFormData>` class.
- `Field`
  - A form field component.
