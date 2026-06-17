---
id: createErrorVisibility
title: createErrorVisibility
---

# Function: createErrorVisibility()

```ts
function createErrorVisibility(visibility): ReusableErrorVisibility;
```

Defined in: [validation.public.ts:234](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L234)

Creates a reusable, form-agnostic error visibility policy.

Use an inline `errorVisibility` callback instead when the policy needs
strongly typed access to the consuming form's `values`.

## Parameters

### visibility

(`context`) => `boolean`

## Returns

[`ReusableErrorVisibility`](../type-aliases/ReusableErrorVisibility.md)
