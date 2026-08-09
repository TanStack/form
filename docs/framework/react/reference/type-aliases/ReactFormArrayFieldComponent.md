---
id: ReactFormArrayFieldComponent
title: ReactFormArrayFieldComponent
---

# Type Alias: ReactFormArrayFieldComponent\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type ReactFormArrayFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:183](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L183)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`ReactFormFieldProps`](../interfaces/ReactFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
