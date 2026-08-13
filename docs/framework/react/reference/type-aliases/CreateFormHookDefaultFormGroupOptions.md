---
id: CreateFormHookDefaultFormGroupOptions
title: CreateFormHookDefaultFormGroupOptions
---

# Type Alias: CreateFormHookDefaultFormGroupOptions

```ts
type CreateFormHookDefaultFormGroupOptions = Pick<FormGroupOptions<unknown, string, unknown, FormGroupValidators<unknown>, FormErrorTypes>, "onSubmitInvalid">;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:105](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L105)

Form group defaults that do not participate in group value inference.

This type is limited to `onSubmitInvalid`. Its callback context exposes the
form and group values as `unknown`, so value-dependent behavior remains
local to the `form.FormGroup` component. Options passed to
`form.FormGroup` override these defaults, including when an option is
explicitly `undefined`.

## Example

```tsx
const { useAppForm } = createFormHook({
  formComponents: {},
  fieldComponents: {},
  defaultFormGroupOptions: {
    onSubmitInvalid: ({ groupApi }) => {
      console.error('Invalid group', groupApi.name)
    },
  },
})
```
