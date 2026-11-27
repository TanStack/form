---
id: VueFormFieldProps
title: VueFormFieldProps
---

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:96](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L96)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### \[fieldComponentsType\]?

```ts
readonly optional [fieldComponentsType]?: TFieldComponents;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:118](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L118)
