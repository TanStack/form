---
id: ReactFormGroupArrayFieldComponent
title: ReactFormGroupArrayFieldComponent
---

# Type Alias: ReactFormGroupArrayFieldComponent()\<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = <TFieldName, TFieldValue, TFieldValidators>(props) => CrossVersionReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:367](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L367)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* `FormGroupValidatorMetas`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `DeepKeysWhereValueIncludes`\<`TGroupValue`, `any`[]\>

### TFieldValue

`TFieldValue` = `DeepValue`\<`TGroupValue`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `TFieldValue`\> = \[\]

## Parameters

### props

[`ReactFormArrayFieldProps`](../interfaces/ReactFormArrayFieldProps.md)\<`TGroupValue`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupValidatorMetas`, `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

## Returns

[`CrossVersionReactNode`](CrossVersionReactNode.md)
