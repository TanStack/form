---
id: useField
title: useField
---

### `UseField<TParentData>`

A type representing a hook for using a field in a form with the given form data type.

```tsx
export type UseField<TParentData> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator
  >,
) => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  DeepValue<TParentData, TName>
>
```

- A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.

### `useField`

```tsx
export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>(
  opts: UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
): FieldApi<TParentData, TName, TFieldValidator, TFormValidator> 
```

A hook for managing a field in a form.

- ```tsx
  opts: UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>
  ```
  - An object with field options.

#### Returns

- ```tsx
  FieldApi<TParentData, TName, TFieldValidator, TFormValidator>
  ```
  - The `FieldApi` instance for the specified field.
