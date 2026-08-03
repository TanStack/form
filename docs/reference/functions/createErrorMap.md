---
id: createErrorMap
title: createErrorMap
---

# Function: createErrorMap()

```ts
function createErrorMap<TFormData>(initial?): ValidationErrorMap<TFormData>;
```

Defined in: [validation.public.ts:372](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L372)

Creates a mutable validation error map.

If an initial error map is provided, the same object is returned.

## Type Parameters

### TFormData

`TFormData`

## Parameters

### initial?

`Partial`\<[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>\>

## Returns

[`ValidationErrorMap`](../interfaces/ValidationErrorMap.md)\<`TFormData`\>
