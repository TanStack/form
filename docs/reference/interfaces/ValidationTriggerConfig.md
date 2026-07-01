---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

# Interface: ValidationTriggerConfig\<TFormData, TValue, TTrigger\>

Defined in: [packages/form-core/src/validation.public.ts:273](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L273)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md) = [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md)

## Properties

### trigger

```ts
trigger: TTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:278](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L278)

***

### when?

```ts
optional when: 
  | boolean
| ValidationPredicateFn<TFormData, TValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:279](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L279)
