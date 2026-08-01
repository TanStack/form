---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

# Interface: ValidationTriggerConfig\<TFormData, TValue, TTrigger, TScope\>

Defined in: [validation.public.ts:318](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L318)

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

Defined in: [validation.public.ts:324](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L324)

***

### when?

```ts
optional when: 
  | boolean
| ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [validation.public.ts:325](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L325)
