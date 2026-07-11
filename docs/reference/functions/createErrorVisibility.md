---
id: createErrorVisibility
title: createErrorVisibility
---

# Function: createErrorVisibility()

```ts
function createErrorVisibility(visibility): ReusableErrorVisibility;
```

Defined in: [packages/form-core/src/validation.public.ts:263](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L263)

Creates a reusable, form-agnostic error visibility policy.

Use an inline `errorVisibility` callback instead when the policy needs
strongly typed access to the consuming form's `values`.

## Parameters

### visibility

(`context`) => `boolean`

## Returns

[`ReusableErrorVisibility`](../type-aliases/ReusableErrorVisibility.md)
