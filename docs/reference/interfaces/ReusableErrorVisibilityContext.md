---
id: ReusableErrorVisibilityContext
title: ReusableErrorVisibilityContext
---

Defined in: [FormApi/errorVisibility.public.ts:52](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/errorVisibility.public.ts#L52)

State available to a visibility policy shared across different form shapes.

## Properties

### fieldState

```ts
fieldState: ErrorVisibilityFieldState;
```

Defined in: [FormApi/errorVisibility.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/errorVisibility.public.ts#L56)

The field whose errors the policy controls.

***

### state

```ts
state: ReusableErrorVisibilityState;
```

Defined in: [FormApi/errorVisibility.public.ts:54](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/errorVisibility.public.ts#L54)

Form state with group-scoped flags and counters for fields in a form group.
