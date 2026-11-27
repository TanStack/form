---
id: AppFormHookResult
title: AppFormHookResult
---

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:147](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L147)

App Form hooks and helpers bound to the components registered with
`createFormHook`.

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](../type-aliases/AnyReactFormComponentMap.md)

Library-managed. Do not specify explicitly.

## Properties

### appFormOptions

```ts
appFormOptions: FormOptionsApi<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:174](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L174)

Defines reusable form options that retain the components registered with
`createFormHook`.

Use the result with `ReactFormType` when a child component needs the type
of one known App Form, including its registered field and form components.

#### Example

```tsx
const profileOptions = appFormOptions({
  defaultValues: { name: '' },
})

type ProfileForm = ReactFormType<typeof profileOptions>

function NameField({ form }: { form: ProfileForm }) {
  return (
    <form.Field name="name">
      {(field) => <field.TextField label="Name" />}
    </form.Field>
  )
}
```

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:213](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L213)

Defines a field group whose fields expose the field components registered
with `createFormHook`.

#### Example

```tsx
const { defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})

const passwordFieldGroup = defineAppFieldGroup(({ strict }) => ({
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
        {(field) => <field.TextField label="Password" />}
      </fields.Field>
      <fields.Field name="confirmPassword">
        {(field) => (
          <field.TextField label="Confirm password" />
        )}
      </fields.Field>
    </>
  )
}
```

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:236](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L236)

Creates a React form API extended with the field and form components
registered with `createFormHook`.

Form data, validators, and submission results are inferred from the passed
options.

#### Example

```tsx
function ProfileForm() {
  const form = useAppForm({
    defaultValues: { name: '' },
  })

  return (
    <form.Field name="name">
      {(field) => <field.TextField label="Name" />}
    </form.Field>
  )
}
```
