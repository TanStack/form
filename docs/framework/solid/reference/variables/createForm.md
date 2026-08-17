---
id: createForm
title: createForm
---

# Variable: createForm

```ts
const createForm: CreateFormHook;
```

Defined in: [packages/solid-form/src/createForm.public.ts:58](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.public.ts#L58)

Creates a Solid form whose instance and lifecycle are owned by the current
reactive owner.

Pass an options accessor. `defaultValues` establish the initial state and
inferred form value type, while signals read by the accessor update the same
form instance when they change. The form is cleaned up when its owner is
disposed.

## Example

```tsx
function ProfileForm() {
  const form = createForm(() => ({
    defaultValues: { name: '' },
    onSubmit: ({ value }) => saveProfile(value),
  }))

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

The Solid form API with typed field, subscription, and form-group
components attached.
