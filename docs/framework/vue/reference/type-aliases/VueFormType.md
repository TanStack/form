---
id: VueFormType
title: VueFormType
---

# Type Alias: VueFormType\<TOptions\>

```ts
type VueFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? VueFormApi<TFormData, VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? VueFormApi<TFormData, VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultVueFormComponentMap> : never;
```

Defined in: [packages/vue-form/src/VueForm/formType.public.ts:44](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/formType.public.ts#L44)

Derives the Vue form API type represented by a reusable options object.

Use it to type props for components that belong to one known form shape. It
preserves the inferred form data and any components registered through
`appFormOptions`. Options such as `onSubmit` can be defined either in the
shared options or when the form is created in the component.

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md)\>

The reusable form or app-form options from which the API derives its form data, error, and registered-component types.

## Example

```ts
const profileOptions = formOptions({
  defaultValues: { name: '' },
})

type ProfileForm = VueFormType<typeof profileOptions>

const props = defineProps<{
  form: ProfileForm
}>()
```
