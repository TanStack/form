---
id: useForm
title: useForm
---

# Variable: useForm

```ts
const useForm: UseFormHook<DefaultVueFormComponentMap>;
```

Defined in: [packages/vue-form/src/VueForm/useForm.public.ts:51](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/useForm.public.ts#L51)

Creates a Vue form whose instance and lifecycle are owned by the current
component.

`defaultValues` establish the initial state and inferred form value type. To
update the existing form after creation, pass a reactive options object;
tracked changes are applied without replacing the form instance.

Call this during the component's setup phase. The form mounts with the
component and is cleaned up when the component unmounts.

## Example

```ts
const form = useForm({
  defaultValues: { name: '' },
  onSubmit: ({ value }) => saveProfile(value),
})
```

## Returns

The Vue form API with typed field, subscription, and form-group
components attached.
