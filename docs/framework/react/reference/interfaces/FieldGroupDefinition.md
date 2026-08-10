---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:251](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L251)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<ReactFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:321](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L321)

Binds a component's field-group API prop to concrete paths in a parent
form.

The returned component accepts the original component props except for the
injected field-group API prop. It adds a `form` prop and reuses the injected
prop name for the virtual-to-concrete field binding map.

#### Example

```tsx
const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
  password: strict<string>(),
  confirmPassword: strict<string>(),
}))

interface PasswordFieldsProps {
  fields: typeof passwordFieldGroup.fields
  legend: string
}

function PasswordFields({ fields, legend }: PasswordFieldsProps) {
  return (
    <fieldset>
      <legend>{legend}</legend>
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
    </fieldset>
  )
}

const PasswordSection = passwordFieldGroup.bindComponent(
  PasswordFields,
  'fields',
)

<PasswordSection
  form={form}
  legend="Choose a password"
  fields={{
    password: 'account.password',
    confirmPassword: 'account.confirmPassword',
  }}
/>
```

***

### fields

```ts
fields: ReactFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:259](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L259)

The virtual field-group API injected into the component passed to
`bindComponent`.
