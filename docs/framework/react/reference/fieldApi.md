---
id: fieldApi
title: Field API
---

### `FieldApi<TData, TParentData>`

When using `@tanstack/react-form`, the [core field API](../../reference/fieldApi) is extended with additional methods for React-specific functionality:

- ```tsx
  Field: FieldComponent<TData, TParentData>
  ```
  - A pre-bound and type-safe sub-field component using this field as a root.
