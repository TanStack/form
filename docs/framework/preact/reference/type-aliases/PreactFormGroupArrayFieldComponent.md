---
id: PreactFormGroupArrayFieldComponent
title: PreactFormGroupArrayFieldComponent
---

# Type Alias: PreactFormGroupArrayFieldComponent()\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

```ts
type PreactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:251](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L251)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](../interfaces/PreactFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ComponentChildren`
