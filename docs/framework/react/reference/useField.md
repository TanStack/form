---
id: useField
title: useField
---

### `UseField<TParentData>`

A type representing a hook for using a field in a form with the given form data type.

```tsx
export type UseField = <TField extends DeepKeys<TParentData>>(
  opts?: { name: TField } & FieldOptions<
    DeepValue<TParentData, TField>,
    TParentData
  >,
) => FieldApi<DeepValue<TParentData, TField>, TParentData>
```

- A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.

### `useField`

```tsx
export function useField<TData, TParentData>(
  opts: FieldOptions<TData, TParentData>,
): FieldApi<TData, TParentData>
```

A hook for managing a field in a form.

- ```tsx
  opts: FieldOptions<TData, TParentData>
  ```
  - An object with field options.

#### Returns

- ```tsx
  FieldApi<TData, TParentData>
  ```
  - The `FieldApi` instance for the specified field.

### `createUseField`

```tsx
export function createUseField<TParentData>(
  formApi: FormApi<TParentData>,
): UseField<TParentData>
```

A function that creates a `UseField` hook bound to the given `formApi`.
