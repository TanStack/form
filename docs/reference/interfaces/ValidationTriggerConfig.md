---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

# Interface: ValidationTriggerConfig\<TFormData, TValue, TTrigger, TScope\>

Defined in: [packages/form-core/src/validation.public.ts:331](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L331)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md) = [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md)

### TScope

`TScope` *extends* [`ValidatorScope`](../type-aliases/ValidatorScope.md) = [`ValidatorScope`](../type-aliases/ValidatorScope.md)

## Properties

### trigger

```ts
trigger: TTrigger;
```

Defined in: [packages/form-core/src/validation.public.ts:337](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L337)

***

### when?

```ts
optional when: 
  | boolean
| ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [packages/form-core/src/validation.public.ts:338](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L338)
