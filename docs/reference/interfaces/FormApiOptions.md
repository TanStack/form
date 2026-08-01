---
id: FormApiOptions
title: FormApiOptions
---

# Interface: FormApiOptions\<TFormData, TFormErrorTypes\>

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:80](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L80)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### defaultValues

```ts
defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:85](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L85)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormErrorTypes>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:86](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L86)

***

### formId?

```ts
optional formId: string;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:84](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L84)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, TFormErrorTypes>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:88](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L88)

***

### serverState?

```ts
optional serverState: 
  | ServerFormState<TFormData, any>
  | null;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:89](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L89)

***

### validators?

```ts
optional validators: FormValidators<TFormData>;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L87)
