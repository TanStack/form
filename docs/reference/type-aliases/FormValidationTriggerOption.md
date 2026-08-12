---
id: FormValidationTriggerOption
title: FormValidationTriggerOption
---

# Type Alias: FormValidationTriggerOption\<TFormData, TValue, TScope\>

```ts
type FormValidationTriggerOption<TFormData, TValue, TScope> = 
  | ClientValidationTriggerOption<TFormData, TValue, TScope>
  | ServerValidationTrigger;
```

Defined in: [validation.public.ts:344](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L344)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)
