---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(Component, fieldsPropName) => <TFormData>(props) => ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:203](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L203)

Wraps a component that accepts a field-group API and returns a component
that accepts a form plus virtual-to-concrete field bindings.

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`ReactFieldGroup`](ReactFieldGroup.md)\<`any`, `any`\>

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* [`FieldGroupFieldsPropName`](FieldGroupFieldsPropName.md)\<`TProps`, `TFieldGroup`\>

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
