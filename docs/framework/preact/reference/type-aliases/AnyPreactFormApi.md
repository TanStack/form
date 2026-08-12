---
id: AnyPreactFormApi
title: AnyPreactFormApi
---

# Type Alias: AnyPreactFormApi

```ts
type AnyPreactFormApi = AnyFormApi & PreactTanStackFormComponents<any, any, any>;
```

Defined in: [packages/preact-form/src/PreactForm/formApiTypes.public.ts:50](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/formApiTypes.public.ts#L50)

A Preact form API whose form data and error types are erased.

Use it for reusable Preact components that only need core form operations
and the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common
to every Preact form. Field paths and values are not checked against a
particular form shape; use `PreactFormType` when a component depends on one
known form.

## Example

```tsx
function FormSubmitButton({ form }: { form: AnyPreactFormApi }) {
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      )}
    </form.Subscribe>
  )
}
```
