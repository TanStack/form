---
id: ValidationPredicateContext
title: ValidationPredicateContext
---

# Type Alias: ValidationPredicateContext\<TFormData, TValue, TScope\>

```ts
type ValidationPredicateContext<TFormData, TValue, TScope> = TScope extends "form" ? FormValidationPredicateContext<TFormData> : TScope extends "group" ? FormGroupValidationPredicateContext<TValue> : TScope extends "field" ? FieldValidationPredicateContext<TFormData, TValue> : never;
```

Defined in: [validation.public.ts:292](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L292)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)
