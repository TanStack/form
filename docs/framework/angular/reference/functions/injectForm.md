---
id: injectForm
title: injectForm
---

# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidators, TSubmitReturn>(options): InternalFormApi<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [inject-form.ts:38](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-form.ts#L38)

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

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

The initial form options. `defaultValues` drive form value
inference.

## Returns

`InternalFormApi`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

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
