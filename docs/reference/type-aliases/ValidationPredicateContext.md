---
id: ValidationPredicateContext
title: ValidationPredicateContext
---

```ts
type ValidationPredicateContext<TFormData, TValue, TScope> = TScope extends "form" ? FormValidationPredicateContext<TFormData> : TScope extends "group" ? FormGroupValidationPredicateContext<TValue> : TScope extends "field" ? FieldValidationPredicateContext<TFormData, TValue> : never;
```

Defined in: [validation.public.ts:459](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L459)

Context for validator conditions and delay callbacks, narrowed by `scope`.

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
