---
id: AngularFormType
title: AngularFormType
---

# Type Alias: AngularFormType\<TOptions\>

```ts
type AngularFormType<TOptions> = TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, unknown> ? InternalFormApi<TFormData, TFormValidators, AngularFormTypeSubmitReturn<TSubmitReturn>> : never;
```

Defined in: [form-type.ts:57](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-type.ts#L57)

Derives the Angular form API type represented by a reusable options object.

Use it to type inputs for components that belong to one known form shape.
Options such as `onSubmit` can be defined either in the shared options or
when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`

The reusable form options from which the API derives its form data, validator, and submit-result types.

## Example

```ts
const profileOptions = formOptions({
  defaultValues: { name: '' },
})

type ProfileForm = AngularFormType<typeof profileOptions>

export class NameFieldComponent {
  form = input.required<ProfileForm>()
}
```
