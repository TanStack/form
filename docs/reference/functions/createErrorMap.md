---
id: createErrorMap
title: createErrorMap
---

```ts
function createErrorMap<TFormData>(initial?): ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:615](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L615)

Creates a mutable map of form errors and errors for individual field paths.

Pass the completed map back from a form or group validator to report the errors.

## Type Parameters

### TFormData

`TFormData`

The form or group value shape whose field paths are
accepted by the map. Specify it when calling this helper directly to restrict
`fields` to that shape's paths. Without a known value shape, field paths are
unrestricted. The validator context's `createErrorMap` already uses the form
or group shape and needs no type argument.

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>\>

An existing map to reuse. A missing `fields` object is added to it.

## Returns

[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>

The initial map, if supplied, or a new map with an empty `fields` object.
