---
id: formApi
title: Form API
---

### `FormApi<TFormData>`

When using `@tanstack/react-form`, the [core form API](../../reference/formApi) is extended with additional methods for React-specific functionality:

- ```tsx
  Form: FormComponent
  ```
  - A pre-bound and type-safe form component, specific to this forms instance.
- ```tsx
  Field: FieldComponent<TFormData>
  ```
  - A pre-bound and type-safe field component, specific to this forms instance.
- ```tsx
  useField: UseField<TFormData>
  ```
  - A pre-bound and type-safe custom hook to use fields from this form instance.
- ```tsx
  useStore<TSelected = NoInfer<FormState<TFormData>>>(selector?: (state: NoInfer<FormState<TFormData>>) => TSelected): TSelected
  ```
  - A custom hook to use the form store.
- ```tsx
  Subscribe<TSelected = NoInfer<FormState<TFormData>>>(props: {selector?: (state: NoInfer<FormState<TFormData>>) => TSelected; children: ((state: NoInfer<TSelected>) => React.ReactNode) | React.ReactNode}): any
  ```
  - A subscription component to provide the selected form state to children.
