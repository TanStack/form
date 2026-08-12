---
id: ValidationTriggerOption
title: ValidationTriggerOption
---

# Type Alias: ValidationTriggerOption\<TFormData, TValue, TTrigger, TScope\>

```ts
type ValidationTriggerOption<TFormData, TValue, TTrigger, TScope> = 
  | TTrigger
| ValidationTriggerConfig<TFormData, TValue, TTrigger, TScope>;
```

Defined in: [validation.public.ts:326](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L326)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)
