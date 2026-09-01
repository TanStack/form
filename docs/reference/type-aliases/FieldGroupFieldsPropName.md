---
id: FieldGroupFieldsPropName
title: FieldGroupFieldsPropName
---

# Type Alias: FieldGroupFieldsPropName\<TProps, TFieldGroup\>

```ts
type FieldGroupFieldsPropName<TProps, TFieldGroup> = { [TPropName in keyof TProps]-?: IsSame<TProps[TPropName], TFieldGroup> extends true ? TPropName : never }[keyof TProps];
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:238](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L238)

Finds the component prop whose value type exactly matches a field-group API.

## Type Parameters

### TProps

`TProps`

The component props searched for the field-group API.

### TFieldGroup

`TFieldGroup`

The field-group API type that a prop must exactly
match.
