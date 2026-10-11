---
id: FormValidationTriggerOption
title: FormValidationTriggerOption
---

```ts
type FormValidationTriggerOption<TFormData, TValue, TScope> = 
  | ClientValidationTriggerOption<TFormData, TValue, TScope>
  | ServerValidationTrigger;
```

Defined in: [validation.public.ts:568](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L568)

A client event with an optional condition, or the `'server'` event for a form validator.

Server validation selects validators with a `'server'` trigger independently
of `runOnSubmit`.

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
