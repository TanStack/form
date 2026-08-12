---
id: PreactFormFieldProps
title: PreactFormFieldProps
---

# Interface: PreactFormFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:113](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L113)

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

### children

```ts
children: (fieldApi) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:135](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L135)

#### Parameters

##### fieldApi

[`PreactFieldApi`](../type-aliases/PreactFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupFieldError`, `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`ComponentChildren`
