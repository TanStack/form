---
id: LitFormType
title: LitFormType
---

# Type Alias: LitFormType\<TOptions\>

```ts
type LitFormType<TOptions> = TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? TanStackFormController<TFormData, TFormValidators, LitFormTypeSubmitReturn<TSubmitReturn>> : never;
```

Defined in: [get-form-type.ts:58](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/get-form-type.ts#L58)

Derives the Lit form controller type represented by a reusable options
object.

Use it to type child element properties and render helpers that belong to one
known form shape. Options such as `onSubmit` can be defined either in the
shared options or when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`

The reusable form options from which the controller derives its form data, validator, and submit-result types.

## Example

```ts
const profileOptions = formOptions({
  defaultValues: { name: '' },
})

type ProfileForm = LitFormType<typeof profileOptions>

function nameField(form: ProfileForm) {
  return form.field({ name: 'name' }, (field) => html`
    <input .value=${field.value} />
  `)
}
```
