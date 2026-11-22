---
id: SolidFormGroupArrayFieldComponent
title: SolidFormGroupArrayFieldComponent
---

Defined in: [packages/solid-form/src/Components.public.ts:236](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L236)

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
SolidFormGroupArrayFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:243](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L243)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`Element`
