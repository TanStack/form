---
id: ReusableErrorVisibility
title: ReusableErrorVisibility
---

```ts
type ReusableErrorVisibility = <TFormData, TFormErrorTypes>(context) => boolean;
```

Defined in: [validation.public.ts:372](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L372)

An error visibility policy that accepts forms with different value and error types.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Parameters

### context

[`ErrorVisibilityContext`](../interfaces/ErrorVisibilityContext.md)\<`TFormData`, `TFormErrorTypes`\>

## Returns

`boolean`
