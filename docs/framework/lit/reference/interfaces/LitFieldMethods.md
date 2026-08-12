---
id: LitFieldMethods
title: LitFieldMethods
---

# Interface: LitFieldMethods\<TFieldData, TGroupFieldError, TFormData, TFormErrorTypes\>

Defined in: [tanstack-form-controller.ts:81](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L81)

## Type Parameters

### TFieldData

`TFieldData`

### TGroupFieldError

`TGroupFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Methods

### arrayField()

```ts
arrayField<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:117](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L117)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>\>

#### Returns

`unknown`

***

### field()

```ts
field<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:87](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L87)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `string`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>\>

#### Returns

`unknown`
