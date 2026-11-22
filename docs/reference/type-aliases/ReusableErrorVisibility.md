---
id: ReusableErrorVisibility
title: ReusableErrorVisibility
---

```ts
type ReusableErrorVisibility = <TFormData>(context) => boolean;
```

Defined in: [FormApi/errorVisibility.public.ts:65](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/errorVisibility.public.ts#L65)

An error visibility policy that accepts forms with different value and error types.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### context

[`ErrorVisibilityContext`](../interfaces/ErrorVisibilityContext.md)\<`TFormData`\>

## Returns

`boolean`
