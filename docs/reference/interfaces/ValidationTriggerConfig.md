---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

Defined in: [pipeline/validation/validation.public.ts:373](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L373)

A change or blur event with an optional condition for running validation.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md) = [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md)

Library-managed. Do not specify explicitly.

### TScope

`TScope` *extends* [`ValidatorScope`](../type-aliases/ValidatorScope.md) = [`ValidatorScope`](../type-aliases/ValidatorScope.md)

Library-managed. Do not specify explicitly.

## Properties

### trigger

```ts
trigger: TTrigger;
```

Defined in: [pipeline/validation/validation.public.ts:380](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L380)

The event to match before evaluating `when`.

***

### when?

```ts
optional when?: 
  | boolean
| TTrigger extends "mount" ? never : ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [pipeline/validation/validation.public.ts:389](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L389)

Whether this trigger enables validation when its event occurs.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to enable it for the current event.

#### Default

```ts
true
```
