---
id: PreactFormFieldProps
title: PreactFormFieldProps
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:113](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L113)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children

```ts
children: (fieldApi) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:135](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L135)

#### Parameters

##### fieldApi

[`PreactFieldApi`](../type-aliases/PreactFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupError`, `TFormError`\>, `TFormData`, `TFormError`, `TFieldComponents`\>

#### Returns

`ComponentChildren`
