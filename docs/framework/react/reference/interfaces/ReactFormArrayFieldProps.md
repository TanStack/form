---
id: ReactFormArrayFieldProps
title: ReactFormArrayFieldProps
---

# Interface: ReactFormArrayFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:318](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L318)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupValidatorMetas`, `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* `FormGroupValidatorMetas`

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children()

```ts
children: (fieldApi) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:342](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L342)

#### Parameters

##### fieldApi

[`ReactFieldApi`](../type-aliases/ReactFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldValidatorMetas`\<`TFieldValidators`\>, `TGroupValidatorMetas`, `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TFieldComponents`\>

#### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
