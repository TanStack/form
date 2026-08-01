---
id: ValidationDebounceFn
title: ValidationDebounceFn
---

# Type Alias: ValidationDebounceFn()\<TFormData, TValue, TScope\>

```ts
type ValidationDebounceFn<TFormData, TValue, TScope> = (context) => number;
```

Defined in: [packages/form-core/src/validation.public.ts:312](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L312)

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
