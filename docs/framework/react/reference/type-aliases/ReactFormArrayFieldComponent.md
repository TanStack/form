---
id: ReactFormArrayFieldComponent
title: ReactFormArrayFieldComponent
---

# Type Alias: ReactFormArrayFieldComponent()\<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

```ts
type ReactFormArrayFieldComponent<TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents> = <TFieldName, TFieldValue, TFieldValidators>(props) => CrossVersionReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:271](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L271)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `DeepKeysWhereValueIncludes`\<`TFormData`, `any`[]\>

### TFieldValue

`TFieldValue` = `DeepValue`\<`TFormData`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\> = \[\]

## Parameters

### props

[`ReactFormArrayFieldProps`](../interfaces/ReactFormArrayFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

## Returns

[`CrossVersionReactNode`](CrossVersionReactNode.md)
