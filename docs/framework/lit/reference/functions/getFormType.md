---
id: getFormType
title: getFormType
---

# Function: getFormType()

```ts
function getFormType<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>(_formOptions): TanStackFormController<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
```

Defined in: [getFormType.ts:43](https://github.com/TanStack/form/blob/main/packages/lit-form/src/getFormType.ts#L43)

A type-only helper that returns a value whose type matches the
`TanStackFormController` instance that would be produced for the given
`FormOptions`. It does not run any logic at runtime.

Use this together with shared `formOptions` to derive the expected
controller type for a `form` property on a child Lit element, without
having to spell out all of `TanStackFormController`'s generics by hand.

## Type Parameters

### TFormData

`TFormData`

### TOnMount

`TOnMount` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnChange

`TOnChange` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnChangeAsync

`TOnChangeAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnBlur

`TOnBlur` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnBlurAsync

`TOnBlurAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnSubmit

`TOnSubmit` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnDynamic

`TOnDynamic` *extends* `FormValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TOnServer

`TOnServer` *extends* `FormAsyncValidateOrFn`\<`TFormData`\> \| `undefined`

### TSubmitMeta

`TSubmitMeta`

## Parameters

### \_formOptions

`FormOptions`\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

## Returns

[`TanStackFormController`](../classes/TanStackFormController.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

## Example

```ts
import { formOptions, getFormType } from '@tanstack/lit-form'

export const peopleFormOpts = formOptions({
  defaultValues: { firstName: '', lastName: '' },
})

// In a child element:
class ChildForm extends LitElement {
  @property({ attribute: false })
  form!: ReturnType<typeof getFormType<typeof peopleFormOpts.defaultValues, ...>>
}
```

Most users will pass `formOptions` directly:

```ts
const formType = getFormType(peopleFormOpts)

class ChildForm extends LitElement {
  @property({ attribute: false })
  form!: typeof formType
}
```
