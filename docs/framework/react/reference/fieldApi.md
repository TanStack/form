---
id: fieldApi
title: Field API
---

### `FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>`

When using `@tanstack/react-form`, the [core field API](../../../../reference/fieldApi) is extended at type level with additional methods for React-specific functionality:

- ```tsx
  Field: FieldComponent<TParentData, TFormValidator>
  ```
  - A pre-bound and type-safe sub-field component using this field as a root.
