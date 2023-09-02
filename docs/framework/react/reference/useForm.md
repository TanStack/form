---
id: useForm
title: useForm
---

### `useForm`

```tsx
export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData>
```
A custom react hook that returns an instance of the `FormApi<TData>` class.




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
  getFormProps: () => FormProps
```
- Function that returns `FormProps`

```tsx
   Field: FieldComponent<TFormData, TFormData>getFormProps: () => FormProps
```
- Field is a generic of `FieldComponent<TFormData, TFormdata>` getFromProps and returns `FormProps`

```tsx
   useField: UseField<TFormData>
```
- UseField is a generic Hook of `UseField<TFormData>`
- type of `useField` can be seen below

```tsx
  type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(opts?: any) => FieldApi<DeepValue<TFormData, TField>, TFormData>
```
```tsx
   useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
```
- a `useStore` hook that takes and optional `selector` and returns type of `TSelected`


```tsx
   Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children:
        | ((state: NoInfer<TSelected>) => React.ReactNode)
        | React.ReactNode
    }) => any
```
- a `Subscribe` function of a generic type, `<TSelected = NoInfer<FormState<TFormData>>>` takes some props `selector` which is an optional property that returns a `TSelected` and a `children`that returns a `ReactNode`, the function itself returns a type of `any`
