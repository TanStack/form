---
id: createErrorVisibility
title: createErrorVisibility
---

```ts
function createErrorVisibility(visibility): ReusableErrorVisibility;
```

Defined in: [validation.public.ts:388](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L388)

Creates an error visibility policy that can be shared across forms with different values.

Use an inline `errorVisibility` callback instead when the policy needs
strongly typed access to the consuming form's `values`.

## Parameters

### visibility

(`context`) => `boolean`

Returns `true` to show the field's errors, or `false` to hide them.

## Returns

[`ReusableErrorVisibility`](../type-aliases/ReusableErrorVisibility.md)

The policy to assign to a form or field's `errorVisibility` option.
