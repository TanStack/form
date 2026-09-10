---
id: useForm
title: useForm
---

# Variable: useForm

```ts
const useForm: UseFormHook<DefaultReactFormComponentMap>;
```

Defined in: [packages/react-form/src/ReactForm/useForm.public.ts:62](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/useForm.public.ts#L62)

Creates a React form whose instance and lifecycle are owned by the current
component.

`defaultValues` establish the initial state and inferred form value type.
Later renders apply changed options to the same form instance, and unmounting
the component cleans it up.

Call this hook at the top level of a React component or custom hook.

## Example

```tsx
function ProfileForm() {
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: ({ value }) => saveProfile(value),
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    />
  )
}
```

## Returns

The React form API with typed field, subscription, and form-group
components attached.
