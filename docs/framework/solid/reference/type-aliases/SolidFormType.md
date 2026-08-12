---
id: SolidFormType
title: SolidFormType
---

# Type Alias: SolidFormType\<TOptions\>

```ts
type SolidFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? SolidFormApi<TFormData, SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? SolidFormApi<TFormData, SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultSolidFormComponentMap> : never;
```

Defined in: [packages/solid-form/src/formType.public.ts:48](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/formType.public.ts#L48)

Derives the Solid form API type represented by a reusable options object.

Use it to type props for components that belong to one known form shape. It
preserves the inferred form data and any components registered through
`appFormOptions`. Options such as `onSubmit` can be defined either in the
shared options or when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md)\>

## Example

```tsx
const profileOptions = formOptions({
  defaultValues: { name: '' },
})

type ProfileForm = SolidFormType<typeof profileOptions>

function NameField(props: {
  form: ProfileForm
}) {
  return (
    <props.form.Field name="name">
      {(field) => <input value={field().value} />}
    </props.form.Field>
  )
}
```
