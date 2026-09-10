---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

# Interface: FieldGroupFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:20](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L20)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

```ts
FieldGroupFieldComponent<TFieldName>(props): ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:67](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L67)

Renders a field from this field group.

The field name is automatically connected to the form section where the
field group is used.

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

## Parameters

### props

[`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ReactNode`

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
```
