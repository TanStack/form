---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L118)

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

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:145](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L145)

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

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:184](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L184)

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

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:209](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L209)

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
    <form.AppForm>
      <form.Field name="name">
        {(field) => <field.TextField label="Name" />}
      </form.Field>
    </form.AppForm>
  )
}
```

***

### useFormContext

```ts
useFormContext: () => ReactAppFormApi<any, any, TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:233](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L233)

Reads the current App Form API from the nearest `form.AppForm` provider.

Use this hook inside form components registered with `createFormHook`. It
throws when called outside a `form.AppForm` subtree.

#### Returns

[`ReactAppFormApi`](../type-aliases/ReactAppFormApi.md)\<`any`, `any`, `TComponents`\>

#### Example

```tsx
function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {label}
        </button>
      )}
    </form.Subscribe>
  )
}
```
