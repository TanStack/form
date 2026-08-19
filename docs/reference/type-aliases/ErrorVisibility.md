---
id: ErrorVisibility
title: ErrorVisibility
---

# Type Alias: ErrorVisibility\<TFormData, TFormErrorTypes\>

```ts
type ErrorVisibility<TFormData, TFormErrorTypes> = (context) => boolean;
```

Defined in: [validation.public.ts:227](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L227)

Decides whether a field exposes its validation errors publicly.

For fields inside a form group, scalar meta properties read from `state` are
scoped to the containing group. `values` and `errors` remain
form-wide.

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](../interfaces/FormErrorTypes.md)

## Parameters

### context

[`ErrorVisibilityContext`](../interfaces/ErrorVisibilityContext.md)\<`TFormData`, `TFormErrorTypes`\>

## Returns

`boolean`
