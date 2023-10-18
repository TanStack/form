---
id: useForm
title: useForm
---

### `useForm`

```tsx
export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData>
```
A custom react hook that returns an instance of the `FormApi<TData>` class.
This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields



### `FormProps`

An object type representing the form component props.

- Inherits from `React.HTMLProps<HTMLFormElement>`.
- `children: React.ReactNode`
  - The form's child elements.

```tsx
  onSubmit: (e: FormSubmitEvent) => void
```
  - `onSubmit` function of type `FormSubmitEvent = React.FormEvent<HTMLFormElement>`

```tsx
  disabled: boolean
```
  - `disabled` boolean to disable form



### Return value of `UseForm` is  `FormApi<TFormData>`

- The `FormApi` contains the following properties

```tsx
Provider: (props: { children: any }) => any
```
- React provider use to wrap your components
- Reference React [ContextProvider]("https://react.dev/reference/react/createContext#provider")



```tsx
   Field: FieldComponent<TFormData, TFormData>getFormProps: () => FormProps
```
- A React component to render form fields. With this, you can render and manage individual form fields.

```tsx
   useField: UseField<TFormData>
```
- A custom React hook that provides functionalities related to individual form fields. It gives you access to field values, errors, and allows you to set or update field values.


```tsx
   useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
```
- a `useStore` hook that connects to the internal store of the form. It can be used to access the form's current state or any other related state information. You can optionally pass in a selector function to cherry-pick specific parts of the state


```tsx
   Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children:
        | ((state: NoInfer<TSelected>) => React.ReactNode)
        | React.ReactNode
    }) => any
```
- a `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
