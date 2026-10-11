---
id: ErrorVisibility
title: ErrorVisibility
---

```ts
type ErrorVisibility<TFormData, TFormErrorTypes> = (context) => boolean;
```

Defined in: [validation.public.ts:340](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L340)

Returns `true` to show a field's validation errors in `field.errors`.

Hidden errors remain available in `field.meta.original.errors`.

For fields inside a form group, `state` properties such as `isTouched` and
`submissionAttempts` describe the containing group. `values` and `errors`
still describe the whole form.

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
