---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [FormApi/FormApi.public.ts:51](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L51)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Properties

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:57](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L57)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, ToFormValidatorMetas<TFormValidators>, SubmitMeta<ValidationIssue, ValidationIssue>>;
```

Defined in: [FormApi/FormApi.public.ts:58](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L58)

***

### formId?

```ts
optional formId: string;
```

Defined in: [FormApi/FormApi.public.ts:56](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L56)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, ToFormValidatorMetas<TFormValidators>, SubmitMeta<ValidationIssue, ValidationIssue>>;
```

Defined in: [FormApi/FormApi.public.ts:64](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L64)

***

### onSubmit()?

```ts
optional onSubmit: (context) => TSubmitReturn;
```

Defined in: [FormApi/FormApi.public.ts:69](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L69)

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, [`ToFormValidatorMetas`](../type-aliases/ToFormValidatorMetas.md)\<`TFormValidators`\>\>

#### Returns

`TSubmitReturn`

***

### validators?

```ts
optional validators: TFormValidators;
```

Defined in: [FormApi/FormApi.public.ts:63](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L63)
