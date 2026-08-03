---
id: createErrorVisibility
title: createErrorVisibility
---

# Function: createErrorVisibility()

```ts
function createErrorVisibility(visibility): ReusableErrorVisibility;
```

Defined in: [validation.public.ts:248](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L248)

Creates a reusable, form-agnostic error visibility policy.

Use an inline `errorVisibility` callback instead when the policy needs
strongly typed access to the consuming form's `values`.

## Parameters

### visibility

(`context`) => `boolean`

## Returns

[`ReusableErrorVisibility`](../type-aliases/ReusableErrorVisibility.md)
