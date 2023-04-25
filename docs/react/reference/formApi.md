---
id: formApi
title: Form API
---

### `FormApi<TFormData>`

When using `@tanstack/react-form`, the [core form API](../../core//reference/formApi.md) is extended with additional methods for React-specific functionality:

- `Form: FormComponent`
  - A pre-bound and type-safe form component, specific to this forms instance.
- `Field: FieldComponent<TFormData>`
  - A pre-bound and type-safe field component, specific to this forms instance.
- `useField: UseField<TFormData>`
  - A pre-bound and type-safe custom hook to use fields from this form instance.
- `useStore<TSelected = NoInfer<FormState<TFormData>>>(selector?: (state: NoInfer<FormState<TFormData>>) => TSelected): TSelected`
  - A custom hook to use the form store.
- `Subscribe<TSelected = NoInfer<FormState<TFormData>>>(props: {selector?: (state: NoInfer<FormState<TFormData>>) => TSelected; children: ((state: NoInfer<TSelected>) => React.ReactNode) | React.ReactNode}): any`
  - A subscription component to provide the selected form state to children.
