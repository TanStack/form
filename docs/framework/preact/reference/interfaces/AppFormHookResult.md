---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L118)

App Form hooks and helpers bound to the components registered with
`createFormHook`.

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](../type-aliases/AnyPreactFormComponentMap.md)

Library-managed. Do not specify explicitly.

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:145](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L145)

Defines reusable form options that retain the components registered with
`createFormHook`.

Use the result with `PreactFormType` when a child component needs the type
of one known App Form, including its registered field and form components.

#### Example

```tsx
const profileOptions = appFormOptions({
  defaultValues: { name: '' },
})

type ProfileForm = PreactFormType<typeof profileOptions>

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

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:177](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L177)

Defines a reusable field group whose fields expose the field components
registered with `createFormHook`.

#### Example

```tsx
const { defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})

const contactFields = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
  email: strict<string>(),
}))

function ContactFields({
  fields,
}: {
  fields: typeof contactFields.fields
}) {
  return (
    <fields.Field name="name">
      {(field) => <field.TextField label="Name" />}
    </fields.Field>
  )
}
```

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:202](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L202)

Creates a Preact form API extended with the field and form components
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
useFormContext: () => PreactAppFormApi<any, any, TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:226](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L226)

Reads the current App Form API from the nearest `form.AppForm` provider.

Use this hook inside form components registered with `createFormHook`. It
throws when called outside a `form.AppForm` subtree.

#### Returns

[`PreactAppFormApi`](../type-aliases/PreactAppFormApi.md)\<`any`, `any`, `TComponents`\>

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
