---
id: field
title: Field
---

### `type FieldComponent<TFormData>`

A type alias representing a field component for a specific form data type.

```tsx
export type FieldComponent = <TField extends DeepKeys<TFormData>>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<DeepValue<TFormData, TField>, TFormData>) => any
  name: TField
} & Omit<FieldOptions<DeepValue<TFormData, TField>, TFormData>, 'name'>) => any
```

A function component that takes field options and a render function as children and returns a React component.

### `Field`

```tsx
export function Field<TData, TFormData>({
  children,
  ...fieldOptions
}: { children: (fieldApi: FieldApi<TData, TFormData>) => any } & FieldOptions<
  TData,
  TFormData
>): any
```

A functional React component that renders a form field.

- ```tsx
  children: (fieldApi: FieldApi<TData, TFormData>) => any
  ```
  - A render function that takes a field API instance and returns a React element.
- ```tsx
  fieldOptions: FieldOptions<TData, TFormData>
  ```
  - The field options.

The `Field` component uses the `useField` hook internally to manage the field instance.

### `createFieldComponent`

```tsx
export function createFieldComponent<TFormData>(
  formApi: FormApi<TFormData>,
): FieldComponent<TFormData>
```

A factory function that creates a connected field component for a specific form API instance.

- ```tsx
  formApi: FormApi<TFormData>
  ```
  - The form API instance to connect the field component to.
