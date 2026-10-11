---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

Defined in: [validation.public.ts:506](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L506)

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

Defined in: [validation.public.ts:513](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L513)

The event to match before evaluating `when`.

***

### when?

```ts
optional when?: 
  | boolean
| ValidationPredicateFn<TFormData, TValue, TScope>;
```

Defined in: [validation.public.ts:522](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L522)

Whether this trigger enables validation when its event occurs.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to enable it for the current event.

#### Default

```ts
true
```
