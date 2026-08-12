---
id: ReactFormType
title: ReactFormType
---

# Type Alias: ReactFormType\<TOptions\>

```ts
type ReactFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? ReactFormApi<TFormData, ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? ReactFormApi<TFormData, ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultReactFormComponentMap> : never;
```

Defined in: [packages/react-form/src/ReactForm/formType.public.ts:56](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/ReactForm/formType.public.ts#L56)

Derives the React form API type represented by a reusable options object.

Use it to type props for components that belong to one known form shape. It
preserves the inferred form data and any components registered through
`appFormOptions`. Options such as `onSubmit` can be defined either in the
shared options or when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)\>

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
