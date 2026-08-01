---
id: SolidTanStackFormComponents
title: SolidTanStackFormComponents
---

# Interface: SolidTanStackFormComponents\<TFormData, TFormErrorTypes\>

Defined in: [packages/solid-form/src/createForm.public.ts:89](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L89)

## Extended by

- [`SolidFormApi`](SolidFormApi.md)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Properties

### ArrayField()

```ts
ArrayField: <TFieldName, TFieldValue, TFieldValidators>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:113](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L113)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValue

`TFieldValue`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

#### Parameters

##### props

[`SolidFormArrayFieldProps`](SolidFormArrayFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TFormErrorTypes`\>

#### Returns

`Element`

***

### Field()

```ts
Field: <TFieldName, TFieldValue, TFieldValidators>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:96](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L96)

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

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TFormErrorTypes`\>

#### Returns

`Element`

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:130](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L130)

#### Type Parameters

##### TSelected

`TSelected`

#### Parameters

##### props

[`SolidFormSubscribeProps`](SolidFormSubscribeProps.md)\<`TFormData`, `TFormErrorTypes`, `TSelected`\>

#### Returns

`Element`
