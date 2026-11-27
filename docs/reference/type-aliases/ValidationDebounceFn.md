---
id: ValidationDebounceFn
title: ValidationDebounceFn
---

```ts
type ValidationDebounceFn<TFormData, TValue, TScope> = (context) => number;
```

Defined in: [pipeline/validation/validation.public.ts:359](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L359)

Chooses the delay in milliseconds before change or blur validation runs.

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

`number`

The delay for the current event. Zero or a negative value runs validation immediately.
