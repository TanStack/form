---
id: ReactFormFieldProps
title: ReactFormFieldProps
---

# Interface: ReactFormFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:121](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L121)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupFieldError

`TGroupFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children()

```ts
children: (fieldApi) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:143](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L143)

#### Parameters

##### fieldApi

[`ReactFieldApi`](../type-aliases/ReactFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`TFieldValidators`, `TGroupFieldError`, `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
