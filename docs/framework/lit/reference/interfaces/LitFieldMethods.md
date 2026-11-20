---
id: LitFieldMethods
title: LitFieldMethods
---

Defined in: [tanstack-form-controller.ts:80](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L80)

## Type Parameters

### TFieldData

`TFieldData`

### TGroupFieldError

`TGroupFieldError`

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

## Methods

### arrayField()

```ts
arrayField<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:116](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L116)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormError`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormError`\>\>

#### Returns

`unknown`

***

### field()

```ts
field<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:86](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L86)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `string`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormError`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormError`\>\>

#### Returns

`unknown`
