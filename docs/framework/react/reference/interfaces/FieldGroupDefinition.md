---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:118](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L118)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<ReactFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:191](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L191)

Binds a component's field-group API prop to concrete paths in a parent
form.

The returned component accepts the original component props except for the
injected field-group API prop and adds a `form` prop. When every virtual
field name is already a compatible form path, those paths bind
automatically when the bindings prop is omitted. A complete bindings map
can still reroute them. Otherwise, the injected prop name is reused for the
required virtual-to-concrete field binding map.

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

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:126](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L126)

The virtual field-group API injected into the component passed to
`bindComponent`.
