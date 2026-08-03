---
id: FormApiOptions
title: FormApiOptions
---

# Interface: FormApiOptions\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L214)

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

Defined in: [FormApi/FormApi.public.ts:219](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L219)

***

### errorVisibility?

```ts
optional errorVisibility: ErrorVisibility<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:220](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L220)

***

### formId?

```ts
optional formId: string;
```

Defined in: [FormApi/FormApi.public.ts:218](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L218)

***

### listeners?

```ts
optional listeners: FormListeners<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:222](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L222)

***

### serverState?

```ts
optional serverState: 
  | ServerFormState<TFormData, any>
  | null;
```

Defined in: [FormApi/FormApi.public.ts:223](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L223)

***

### validators?

```ts
optional validators: FormValidators<TFormData>;
```

Defined in: [FormApi/FormApi.public.ts:221](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L221)
