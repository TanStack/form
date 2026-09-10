---
id: defineFieldGroup
title: defineFieldGroup
---

# Variable: defineFieldGroup

```ts
const defineFieldGroup: DefineFieldGroupFn<Record<never, never>>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:255](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L255)

Defines a reusable group of virtual fields that can be bound to concrete
paths in different parent forms.

Use `strict` when a binding must have exactly the declared value type. Use
`loose` when a binding may have the declared type or a narrower assignable
type.

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
