---
id: SolidFormFieldProps
title: SolidFormFieldProps
---

Defined in: [packages/solid-form/src/Components.public.ts:93](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L93)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`\>

## Extended by

- [`SolidFormArrayFieldProps`](SolidFormArrayFieldProps.md)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### children

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:111](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L111)

#### Parameters

##### fieldApi

[`SolidFieldApi`](../type-aliases/SolidFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupError`, `TFormError`\>, `TFormData`, `TFormError`, `TFieldComponents`\>

#### Returns

`Element`
