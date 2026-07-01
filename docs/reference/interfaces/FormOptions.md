---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:52](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L52)

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

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:58](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L58)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, ToFormValidatorMetas<TFormValidators>, SubmitMeta<ValidationIssue, ValidationIssue>>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:59](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L59)

***

### formId?

```ts
optional formId: string;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:57](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L57)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, ToFormValidatorMetas<TFormValidators>, SubmitMeta<ValidationIssue, ValidationIssue>>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:65](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L65)

***

### onSubmit()?

```ts
optional onSubmit: (context) => TSubmitReturn;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:74](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L74)

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, [`ToFormValidatorMetas`](../type-aliases/ToFormValidatorMetas.md)\<`TFormValidators`\>\>

#### Returns

`TSubmitReturn`

***

### serverState?

```ts
optional serverState: 
  | ServerFormState<NoInfer<TFormData>, NoInfer<TFormValidators>>
  | null;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:70](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L70)

***

### validators?

```ts
optional validators: TFormValidators;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:64](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L64)
