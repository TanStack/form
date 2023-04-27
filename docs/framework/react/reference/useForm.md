---
id: useForm
title: useForm
---

### `useForm`

```tsx
export function useForm<TData>(
  opts?: FormOptions<TData> & { listen?: (state: FormState<TData>) => any },
): FormApi<TData>
```

A custom hook that returns an instance of the `FormApi<TData>` class.

- `opts`
  - Optional form options and a `listen` function to be called with the form state.

### `FormProps`

An object type representing the form component props.

- Inherits from `React.HTMLProps<HTMLFormElement>`.
- `children: React.ReactNode`
  - The form's child elements.
- `noFormElement?: boolean`
  - If true, the form component will not render an HTML form element.

### `FormComponent`

A type representing a form component.

- `(props: FormProps) => any`
  - A function that takes `FormProps` as an argument and returns a form component.

### `createFormComponent`

```tsx
export function createFormComponent(formApi: FormApi<any>): FormComponent
```

A function that creates a form component with the provided form API instance.

- `formApi`
  - An instance of the `FormApi<any>` class.
