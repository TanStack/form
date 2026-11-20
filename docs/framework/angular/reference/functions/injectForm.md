---
id: injectForm
title: injectForm
---

```ts
function injectForm<TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options): FormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>>;
```

Defined in: [inject-form.ts:42](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-form.ts#L42)

Creates and mounts a form in the current Angular injection context.

`defaultValues` establish the initial state and inferred form value type.
Form state changes notify Angular change detection, including OnPush
components, and the form is cleaned up when the injection context is
destroyed.

Call this in a component field initializer, constructor, provider factory,
or another active injection context.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### options

`FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

The initial form options. `defaultValues` drive form value
inference.

## Returns

`FormApi`\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>\>

The mounted form API registered for injection-context cleanup.

## Example

```ts
@Component({
  selector: 'app-profile-form',
  template: `<form></form>`,
})
class ProfileFormComponent {
  form = injectForm({
    defaultValues: { name: '' },
    onSubmit: ({ value }) => saveProfile(value),
  })
}
```
