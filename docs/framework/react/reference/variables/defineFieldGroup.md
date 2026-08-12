---
id: defineFieldGroup
title: defineFieldGroup
---

# Variable: defineFieldGroup

```ts
const defineFieldGroup: DefineFieldGroupFn<Record<never, never>>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:384](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L384)

Defines a reusable group of virtual fields that can be bound to concrete
paths in different parent forms.

Use `strict` when a binding must have exactly the declared value type. Use
`loose` when bindings may have an overlapping non-nullish value type.

## Example

```tsx
const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
  password: strict<string>(),
  confirmPassword: strict<string>(),
}))

interface PasswordFieldsProps {
  fields: typeof passwordFieldGroup.fields
}

function PasswordFields({ fields }: PasswordFieldsProps) {
  return (
    <>
      <fields.Field name="password">
        {(field) => (
          <input
            type="password"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
      <fields.Field name="confirmPassword">
        {(field) => (
          <input
            type="password"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
    </>
  )
}

export const PasswordSection = passwordFieldGroup.bindComponent(
  PasswordFields,
  'fields',
)
```
