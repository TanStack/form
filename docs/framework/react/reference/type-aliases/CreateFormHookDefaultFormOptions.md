---
id: CreateFormHookDefaultFormOptions
title: CreateFormHookDefaultFormOptions
---

# Type Alias: CreateFormHookDefaultFormOptions

```ts
type CreateFormHookDefaultFormOptions = Pick<FormOptions<unknown, FormValidators<unknown>, unknown>, "formId" | "errorVisibility" | "listeners" | "onSubmitInvalid">;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:43](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L43)

Form defaults that do not participate in form value inference.

This type is limited to `formId`, `errorVisibility`, `listeners`, and
`onSubmitInvalid`. Callback contexts expose form values as `unknown`, so
value-dependent behavior remains local to `useAppForm`. Options passed to
`useAppForm` override these defaults, including when an option is explicitly
`undefined`.

## Example

```tsx
const { useAppForm } = createFormHook({
  formComponents: {},
  fieldComponents: {},
  defaultFormOptions: {
    errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
    onSubmitInvalid: () => {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    },
  },
})
```
