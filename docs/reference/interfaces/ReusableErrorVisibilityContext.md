---
id: ReusableErrorVisibilityContext
title: ReusableErrorVisibilityContext
---

Defined in: [validation.public.ts:359](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L359)

State available to a visibility policy shared across different form shapes.

## Properties

### fieldState

```ts
fieldState: ErrorVisibilityFieldState;
```

Defined in: [validation.public.ts:363](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L363)

The field whose errors the policy controls.

***

### state

```ts
state: ReusableErrorVisibilityState;
```

Defined in: [validation.public.ts:361](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L361)

Form state with group-scoped flags and counters for fields in a form group.
