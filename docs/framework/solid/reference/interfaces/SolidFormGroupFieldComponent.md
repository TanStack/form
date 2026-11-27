---
id: SolidFormGroupFieldComponent
title: SolidFormGroupFieldComponent
---

Defined in: [packages/solid-form/src/Components.public.ts:208](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L208)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormGroupFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:215](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L215)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`Element`
