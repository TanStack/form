---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

Defined in: [pipeline/validation/validation.public.ts:377](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L377)

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

Defined in: [pipeline/validation/validation.public.ts:384](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L384)

The event to match before evaluating `when`.

***

### when?

```ts
optional when?: 
  | boolean
| TTrigger extends "mount" ? never : ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [pipeline/validation/validation.public.ts:393](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L393)

Whether this trigger enables validation when its event occurs.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to enable it for the current event.

#### Default

```ts
true
```
