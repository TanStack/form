---
id: SolidTanStackFormComponents
title: SolidTanStackFormComponents
---

# Interface: SolidTanStackFormComponents\<TFormData, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/solid-form/src/createForm.public.ts:102](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L102)

## Extended by

- [`SolidFormApi`](SolidFormApi.md)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

## Properties

### ArrayField()

```ts
ArrayField: <TFieldName, TFieldValue, TFieldValidators>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:128](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L128)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValue

`TFieldValue`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

#### Parameters

##### props

[`SolidFormArrayFieldProps`](SolidFormArrayFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TFormValidatorMetas`, `TSubmitReturn`\>

#### Returns

`Element`

***

### Field()

```ts
Field: <TFieldName, TFieldValue, TFieldValidators>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:110](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L110)

TODO docs

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `string`

##### TFieldValue

`TFieldValue`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

#### Parameters

##### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TFormValidatorMetas`, `TSubmitReturn`\>

#### Returns

`Element`

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:146](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L146)

#### Type Parameters

##### TSelected

`TSelected`

#### Parameters

##### props

[`SolidFormSubscribeProps`](SolidFormSubscribeProps.md)\<`TFormData`, `TFormValidatorMetas`, `TSubmitReturn`, `TSelected`\>

#### Returns

`Element`
