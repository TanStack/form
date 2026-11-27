---
id: ValidationTriggerOption
title: ValidationTriggerOption
---

```ts
type ValidationTriggerOption<TFormData, TValue, TTrigger, TScope> = TTrigger extends ValidatorTrigger ? 
  | TTrigger
  | ValidationTriggerConfig<TFormData, TValue, TTrigger, TScope> : never;
```

Defined in: [pipeline/validation/validation.public.ts:404](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L404)

A validation event, either unconditional or configured with a `when` condition.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)

Library-managed. Do not specify explicitly.

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)

Library-managed. Do not specify explicitly.
