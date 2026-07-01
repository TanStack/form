---
id: ValidationTriggerOption
title: ValidationTriggerOption
---

# Type Alias: ValidationTriggerOption\<TFormData, TValue, TTrigger\>

```ts
type ValidationTriggerOption<TFormData, TValue, TTrigger> = 
  | TTrigger
| ValidationTriggerConfig<TFormData, TValue, TTrigger>;
```

Defined in: [packages/form-core/src/validation.public.ts:282](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L282)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)
