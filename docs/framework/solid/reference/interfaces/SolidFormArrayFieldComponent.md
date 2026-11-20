---
id: SolidFormArrayFieldComponent
title: SolidFormArrayFieldComponent
---

Defined in: [packages/solid-form/src/Components.public.ts:166](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L166)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormArrayFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:171](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L171)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`Element`
