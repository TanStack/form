---
id: field
title: Field
---

### `FieldComponent<TParentData>`

A type alias representing a field component for a specific form data type.

```tsx
export type FieldComponent = <TField extends DeepKeys<TParentData>>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<DeepValue<TParentData, TField>, TParentData>,
  ) => any
  name: TField
} & Omit<
  FieldOptions<DeepValue<TParentData, TField>, TParentData>,
  'name'
>) => any
```

A function component that takes field options and a render function as children and returns a React component.

### `Field`

```tsx
export function Field<TData, TParentData>({
  children,
  ...fieldOptions
}: { children: (fieldApi: FieldApi<TData, TParentData>) => any } & FieldOptions<
  TData,
  TParentData
>): any
```

A functional React component that renders a form field.

- ```tsx
  children: (fieldApi: FieldApi<TData, TParentData>) => any
  ```
  - A render function that takes a field API instance and returns a React element.
- ```tsx
  fieldOptions: FieldOptions<TData, TParentData>
  ```
  - The field options.

The `Field` component uses the `useField` hook internally to manage the field instance.

### `createFieldComponent`

```tsx
export function createFieldComponent<TParentData>(
  formApi: FormApi<TParentData>,
): FieldComponent<TParentData>
```

A factory function that creates a connected field component for a specific form API instance.

- ```tsx
  formApi: FormApi<TParentData>
  ```
  - The form API instance to connect the field component to.
