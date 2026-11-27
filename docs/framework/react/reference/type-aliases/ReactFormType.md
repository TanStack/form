---
id: ReactFormType
title: ReactFormType
---

```ts
type ReactFormType<TOptions> = TOptions extends AnyFormOptions ? OptionsInferredForm<TOptions> : TOptions extends FormOptionsApi<infer TComponents> ? ReactFormApi<any, any, ComponentOrDefault<TComponents>> : never;
```

Defined in: [packages/react-form/src/ReactForm/formType.public.ts:62](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/formType.public.ts#L62)

Derives the React form API type represented by a reusable options object.

Use it to type props for components that belong to one known form shape. It
preserves the inferred form data and any components registered through
`appFormOptions`. Options such as `onSubmit` can be defined either in the
shared options or when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions` \| `FormOptionsApi`\<`unknown`\>

The reusable form or app-form options from which the API derives its form data, error, and registered-component types.

## Example

```tsx
const profileOptions = formOptions({
  defaultValues: { name: '' },
})

type ProfileForm = ReactFormType<typeof profileOptions>

function NameField(props: {
  form: ProfileForm
}) {
  return (
    <props.form.Field name="name">
      {(field) => <input value={field.value} />}
    </props.form.Field>
  )
}
```
