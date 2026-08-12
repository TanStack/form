---
id: AnyReactFormApi
title: AnyReactFormApi
---

# Type Alias: AnyReactFormApi

```ts
type AnyReactFormApi = AnyFormApi & ReactTanStackFormComponents<any, any, any>;
```

Defined in: [packages/react-form/src/ReactForm/formApiTypes.public.ts:49](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/ReactForm/formApiTypes.public.ts#L49)

A React form API whose form data and error types are erased.

Use it for reusable React components that only need core form operations and
the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
every React form. Field paths and values are not checked against a particular
form shape; use `ReactFormType` when a component depends on one known form.

## Example

```tsx
function FormSubmitButton({ form }: { form: AnyReactFormApi }) {
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
