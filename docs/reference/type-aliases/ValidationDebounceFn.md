---
id: ValidationDebounceFn
title: ValidationDebounceFn
---

# Type Alias: ValidationDebounceFn\<TFormData, TValue, TScope\>

```ts
type ValidationDebounceFn<TFormData, TValue, TScope> = (context) => number;
```

Defined in: [validation.public.ts:310](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L310)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)

## Parameters

### context

[`ValidationPredicateContext`](ValidationPredicateContext.md)\<`TFormData`, `TValue`, `TScope`\>

## Returns

`number`
