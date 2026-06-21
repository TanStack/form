---
id: ErrorVisibility
title: ErrorVisibility
---

# Type Alias: ErrorVisibility()\<TFormData, TFormValidatorMetas, TSubmitReturn\>

```ts
type ErrorVisibility<TFormData, TFormValidatorMetas, TSubmitReturn> = (context) => boolean;
```

Defined in: [validation.public.ts:187](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L187)

Decides whether a field exposes its validation errors publicly.

For fields inside a registered form group, scalar meta properties read from
`state` are scoped to the nearest group. `values` and `errors` remain
form-wide.

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`ValidatorMetas`](ValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Parameters

### context

[`ErrorVisibilityContext`](../interfaces/ErrorVisibilityContext.md)\<`TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>

## Returns

`boolean`
