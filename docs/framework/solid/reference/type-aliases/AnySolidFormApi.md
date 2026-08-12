---
id: AnySolidFormApi
title: AnySolidFormApi
---

# Type Alias: AnySolidFormApi

```ts
type AnySolidFormApi = AnyFormApi & SolidTanStackFormComponents<any, any, any>;
```

Defined in: [packages/solid-form/src/formApiTypes.public.ts:52](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/formApiTypes.public.ts#L52)

A Solid form API whose form data and error types are erased.

Use it for reusable Solid components that only need core form operations and
the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
every Solid form. Field paths and values are not checked against a particular
form shape; use `SolidFormType` when a component depends on one known form.

## Example

```tsx
function FormSubmitButton(props: { form: AnySolidFormApi }) {
  return (
    <props.form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting()}>
          {isSubmitting() ? 'Saving...' : 'Save'}
        </button>
      )}
    </props.form.Subscribe>
  )
}
```
