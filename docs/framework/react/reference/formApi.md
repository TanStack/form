---
id: formApi
title: Form API
---

### `FormApi<TFormData, TFormValidator>`

When using `@tanstack/react-form`, the [core form API](../../reference/formApi) is extended at type level with additional methods for React-specific functionality:

- ```tsx
  Provider: (props: PropsWithChildren) => JSX.Element
  ```
  - React provider use to wrap your components. Reference React's [ContextProvider]("https://react.dev/reference/react/createContext#provider")
- ```tsx
  Field: FieldComponent<TFormData, TFormValidator>
  ```
  - A React component to render form fields. With this, you can render and manage individual form fields.
- ```tsx
  useField: UseField<TFormData>
  ```
  - A custom React hook that provides functionalities related to individual form fields. It gives you access to field values, errors, and allows you to set or update field values.
- ```tsx
  useStore: <TSelected = NoInfer<FormState<TFormData>>>(
        selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
  ) => TSelected
  ```
  - A `useStore` hook that connects to the internal store of the form. It can be used to access the form's current state or any other related state information. You can optionally pass in a selector function to cherry-pick specific parts of the state
- ```tsx
   Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
        selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
        children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
  }) => JSX.Element
  ```
  - A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
