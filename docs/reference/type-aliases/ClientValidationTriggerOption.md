---
id: ClientValidationTriggerOption
title: ClientValidationTriggerOption
---

```ts
type ClientValidationTriggerOption<TFormData, TValue, TScope> = ValidationTriggerOption<TFormData, TValue, ConfigurableValidationTrigger, TScope>;
```

Defined in: [pipeline/validation/validation.public.ts:424](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L424)

A change or blur trigger, optionally enabled by a condition.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)

Library-managed. Do not specify explicitly.
