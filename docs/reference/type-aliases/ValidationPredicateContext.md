---
id: ValidationPredicateContext
title: ValidationPredicateContext
---

# Type Alias: ValidationPredicateContext\<TFormData, TValue, TScope\>

```ts
type ValidationPredicateContext<TFormData, TValue, TScope> = TScope extends "form" ? FormValidationPredicateContext<TFormData> : TScope extends "group" ? FormGroupValidationPredicateContext<TValue> : TScope extends "field" ? FieldValidationPredicateContext<TFormData, TValue> : never;
```

Defined in: [packages/form-core/src/validation.public.ts:294](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L294)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)
