---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:85](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L85)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:129](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L129)

Renders an array field from this field group.

The field name is automatically connected to the form section where the
field group is used.

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ReactNode`

## Example

```tsx
const contactFieldGroup = defineFieldGroup(({ strict }) => ({
  emails: strict<Array<{ value: string }>>(),
}))

interface ContactFieldsProps {
  fields: typeof contactFieldGroup.fields
}

function ContactFields({ fields }: ContactFieldsProps) {
  return (
    <fields.ArrayField name="emails">
      {(emails) => (
        <>
          {emails.value.map((_, index) => (
            <fields.Field key={index} name={`emails[${index}].value`}>
              {(field) => (
                <input
                  value={field.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                />
              )}
            </fields.Field>
          ))}
        </>
      )}
    </fields.ArrayField>
  )
}
```
