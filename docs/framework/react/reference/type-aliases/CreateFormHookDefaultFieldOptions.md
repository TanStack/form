---
id: CreateFormHookDefaultFieldOptions
title: CreateFormHookDefaultFieldOptions
---

# Type Alias: CreateFormHookDefaultFieldOptions

```ts
type CreateFormHookDefaultFieldOptions = Pick<FieldApiOptions<unknown, string, unknown, FieldValidators<unknown, string, unknown>, never, unknown, FormErrorTypes>, "errorVisibility" | "errorBoundary" | "listeners">;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:70](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L70)

Direct field defaults that do not participate in field value inference.

This type is limited to `errorVisibility`, `errorBoundary`, and `listeners`.
Listener contexts expose form and field values as `unknown`, and callbacks
do not receive the concrete value types inferred by the consuming field
component. Options passed to a direct `form.Field` or `form.ArrayField`
override these defaults, including when an option is explicitly
`undefined`.

## Example

```tsx
const { useAppForm } = createFormHook({
  formComponents: {},
  fieldComponents: {},
  defaultFieldOptions: {
    errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
    errorBoundary: true,
  },
})
```
