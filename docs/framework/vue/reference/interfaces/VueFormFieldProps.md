---
id: VueFormFieldProps
title: VueFormFieldProps
---

# Interface: VueFormFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:97](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L97)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### \[fieldComponentsType\]?

```ts
readonly optional [fieldComponentsType]?: TFieldComponents;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:119](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L119)
