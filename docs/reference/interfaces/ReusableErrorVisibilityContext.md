---
id: ReusableErrorVisibilityContext
title: ReusableErrorVisibilityContext
---

Defined in: [validation.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L282)

State available to a visibility policy shared across different form shapes.

## Properties

### fieldState

```ts
fieldState: ErrorVisibilityFieldState;
```

Defined in: [validation.public.ts:286](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L286)

The field whose errors the policy controls.

***

### state

```ts
state: ReusableErrorVisibilityState;
```

Defined in: [validation.public.ts:284](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L284)

Form state with group-scoped flags and counters for fields in a form group.
