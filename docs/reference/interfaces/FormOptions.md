---
id: FormOptions
title: FormOptions
---

# Interface: FormOptions\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:51](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L51)

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

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:57](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L57)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:58](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L58)

***

### formId?

```ts
optional formId: string;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:56](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L56)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, ToFormErrorTypes<TFormValidators, unknown>>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:63](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L63)

***

### onSubmit()?

```ts
optional onSubmit: (context) => TSubmitReturn;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:71](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L71)

#### Parameters

##### context

[`FormSubmitContext`](FormSubmitContext.md)\<`TFormData`, [`ToFormSchemaOutputs`](../type-aliases/ToFormSchemaOutputs.md)\<`TFormValidators`\>, [`ToFormErrorTypes`](../type-aliases/ToFormErrorTypes.md)\<`TFormValidators`, `unknown`\>\>

#### Returns

`TSubmitReturn`

***

### serverState?

```ts
optional serverState: 
  | ServerFormState<NoInfer<TFormData>, NoInfer<TFormValidators>>
  | null;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:67](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L67)

***

### validators?

```ts
optional validators: TFormValidators;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:62](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L62)
