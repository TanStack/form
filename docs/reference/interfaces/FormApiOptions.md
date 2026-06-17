---
id: FormApiOptions
title: FormApiOptions
---

# Interface: FormApiOptions\<TFormData, TFormValidatorMetas, TSubmitMeta\>

Defined in: [FormApi/FormApi.public.ts:77](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L77)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitMeta

`TSubmitMeta`

## Properties

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:83](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L83)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitMeta>;
```

Defined in: [FormApi/FormApi.public.ts:84](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L84)

***

### formId?

```ts
optional formId: string;
```

Defined in: [FormApi/FormApi.public.ts:82](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L82)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, TFormValidatorMetas, TSubmitMeta>;
```

Defined in: [FormApi/FormApi.public.ts:86](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L86)

***

### onSubmit()?

```ts
optional onSubmit: (context) => unknown;
```

Defined in: [FormApi/FormApi.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L87)

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, `TFormValidatorMetas`\>

#### Returns

`unknown`

***

### validators?

```ts
optional validators: FormValidators<TFormData>;
```

Defined in: [FormApi/FormApi.public.ts:85](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L85)
