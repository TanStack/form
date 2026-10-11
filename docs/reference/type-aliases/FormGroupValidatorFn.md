---
id: FormGroupValidatorFn
title: FormGroupValidatorFn
---

```ts
type FormGroupValidatorFn<TGroupValue> = ValidatorFn<FormGroupValidatorContext<TGroupValue>, FormGroupValidateResult<TGroupValue>>;
```

Defined in: [validation.public.ts:908](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L908)

Validates a group's value and can return group errors, field errors, or output data.

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.
