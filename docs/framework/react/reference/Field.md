---
id: field
title: Field
---

### `FieldComponent<TParentData, TFormValidator>`

A type alias representing a field component for a specific form data type.

```tsx
export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
>) => any
```

A function component that takes field options and a render function as children and returns a React component.

### `Field`

```tsx
export function Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator>,
  ) => any
} & UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>): JSX.Element
```

A functional React component that renders a form field.

- ```tsx
  children: (fieldApi: FieldApi<TParentData, TName, TFieldValidator, TFormValidator>) => any
  ```
  - A render function that takes a field API instance and returns a React element.
- ```tsx
  fieldOptions: UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>
  ```
  - The field options.

The `Field` component uses the `useField` hook internally to manage the field instance.

