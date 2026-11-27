---
id: ReactFormArrayFieldProps
title: ReactFormArrayFieldProps
---

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:145](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L145)

## Extends

- [`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

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

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### children

```ts
children: (fieldApi) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:133](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L133)

#### Parameters

##### fieldApi

[`ReactFieldApi`](../type-aliases/ReactFieldApi.md)\<`TFieldName`, `TFieldValue`, `NoInfer`\<`FallbackToValidationIssue`\<
  \| `ExtractValidatorSelfError`\<`TFieldValidators`, `FieldValidators`\<`any`, `any`, `any`\>\>
  \| `ExtractSubfieldError`\<`TGroupError`\>
  \| `ExtractSubfieldError`\<`TFormError`\>\>\>, `TFormData`, `TFormError`, `TFieldComponents`\>

#### Returns

`ReactNode`

#### Inherited from

[`ReactFormFieldProps`](ReactFormFieldProps.md).[`children`](ReactFormFieldProps.md#children)

***

### subscribeToMeta?

```ts
optional subscribeToMeta?: boolean;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:177](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L177)

Whether `ArrayField` also re-renders when the array field's meta changes.

- Set to `true` when the render callback reads `field.meta`, including
  validation errors and flags from subfields.
- This option does not subscribe to every change in individual item values.

#### Default

```ts
false
```
