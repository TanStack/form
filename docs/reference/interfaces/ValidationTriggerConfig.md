---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

# Interface: ValidationTriggerConfig\<TFormData, TValue, TTrigger, TScope\>

Defined in: [validation.public.ts:316](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L316)

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

Defined in: [validation.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L322)

***

### when?

```ts
optional when: 
  | boolean
| ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [validation.public.ts:323](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L323)
