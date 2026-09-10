---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(Component, fieldsPropName) => <TFormData>(props) => ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:100](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L100)

Wraps a component that accepts a field-group API and returns a component
that accepts a form and, when needed, virtual-to-concrete field bindings.

If every virtual field name is already a compatible path in the form, the
returned component binds those paths automatically when the bindings prop is
omitted. A complete bindings map can still reroute them. Otherwise, the
bindings prop is required.

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`ReactFieldGroup`](ReactFieldGroup.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* `FieldGroupFieldsPropName`\<`TProps`, `TFieldGroup`\>

## Parameters

### Component

(`props`) => `ReactNode`

### fieldsPropName

`TFieldsPropName`

## Returns

\<`TFormData`\>(`props`) => `ReactNode`

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
  // ...
}

const PasswordSection = passwordFieldGroup.bindComponent(
  PasswordFields,
  'fields',
)

function AccountForm() {
  const form = useForm({
    defaultValues: {
      account: {
        password: '',
        confirmPassword: '',
      },
    },
  })

  return (
    <PasswordSection
      form={form}
      fields={{
        password: 'account.password',
        confirmPassword: 'account.confirmPassword',
      }}
    />
  )
}
```
