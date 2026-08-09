---
id: ReactFormGroupFieldComponent
title: ReactFormGroupFieldComponent
---

# Interface: ReactFormGroupFieldComponent()\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:225](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L225)

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

```ts
ReactFormGroupFieldComponent<TFieldName, TFieldValidators>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:232](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L232)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
