---
id: AnyLitFormApi
title: AnyLitFormApi
---

# Type Alias: AnyLitFormApi

```ts
type AnyLitFormApi = TanStackFormController<any, any, any>;
```

Defined in: [get-form-type.ts:31](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/get-form-type.ts#L31)

A Lit form controller whose form data, validator, and submit types are
erased.

Use it for reusable render helpers that only need controller operations
common to every form. Field paths and values are not checked against a
particular form shape; use `LitFormType` when a helper depends on one known
form.

## Example

```ts
function formSubmitButton(form: AnyLitFormApi) {
  return form.subscribe(
    (state) => state.isSubmitting,
    (isSubmitting) => html`
      <button type="submit" ?disabled=${isSubmitting}>
        ${isSubmitting ? 'Saving...' : 'Save'}
      </button>
    `,
  )
}
```
