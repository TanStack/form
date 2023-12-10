---
id: createFormFactory
title: createFormFactory
---

### `createFormFactory<TFormData, TFormValidator>`

```tsx
export function createFormFactory<TFormData, TFormValidator>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormFactory<TFormData, TFormValidator>
```

A function that creates a new `FormFactory<TFormData, TFormValidator>` instance.

- `opts`
  - Optional form options.

### `FormFactory<TFormData, TFormValidator>`

A type representing a form factory. Form factories provide a type-safe way to interact with the form API as opposed to using the globally exported form utilities.

```tsx
export type FormFactory<TFormData, TFormValidator> = {
  useForm: (opts?: FormOptions<TFormData, TFormValidator>) => FormApi<TFormData>
  useField: UseField<TFormData>
  Field: FieldComponent<TFormData, TFormValidator>
}
```

- `useForm`
  - A custom hook that creates and returns a new instance of the `FormApi` class.
- `useField`
  - A custom hook that returns an instance of the `FieldApi` class.
- `Field`
  - A form field component.
