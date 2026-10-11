---
id: ValidationPredicateFn
title: ValidationPredicateFn
---

```ts
type ValidationPredicateFn<TFormData, TValue, TScope> = (context) => boolean;
```

Defined in: [validation.public.ts:478](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L478)

Returns `true` to enable validation for the current event or submission attempt.

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

## Parameters

### context

[`ValidationPredicateContext`](ValidationPredicateContext.md)\<`TFormData`, `TValue`, `TScope`\>

## Returns

`boolean`
