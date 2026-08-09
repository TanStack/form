---
id: ValidationPredicateFn
title: ValidationPredicateFn
---

# Type Alias: ValidationPredicateFn\<TFormData, TValue, TScope\>

```ts
type ValidationPredicateFn<TFormData, TValue, TScope> = (context) => boolean;
```

Defined in: [validation.public.ts:304](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L304)

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

`boolean`
