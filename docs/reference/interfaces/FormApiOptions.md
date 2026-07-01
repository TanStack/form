---
id: FormApiOptions
title: FormApiOptions
---

# Interface: FormApiOptions\<TFormData, TFormValidatorMetas, TSubmitMeta\>

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:82](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L82)

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

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:88](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L88)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:89](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L89)

***

### formId?

```ts
optional formId: string;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L87)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, TFormValidatorMetas, TSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:91](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L91)

***

### onSubmit()?

```ts
optional onSubmit: (context) => unknown;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:93](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L93)

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, `TFormValidatorMetas`\>

#### Returns

`unknown`

***

### serverState?

```ts
optional serverState: ServerFormState<TFormData, any> | null;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:92](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L92)

***

### validators?

```ts
optional validators: FormValidators<TFormData>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:90](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L90)
