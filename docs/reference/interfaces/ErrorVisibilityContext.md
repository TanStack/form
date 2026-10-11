---
id: ErrorVisibilityContext
title: ErrorVisibilityContext
---

Defined in: [validation.public.ts:315](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L315)

Form and field state used to decide whether to show a field's errors.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### fieldState

```ts
fieldState: ErrorVisibilityFieldState;
```

Defined in: [validation.public.ts:325](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L325)

The field whose errors the policy controls.

***

### state

```ts
state: FormState<TFormData, TFormErrorTypes>;
```

Defined in: [validation.public.ts:323](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L323)

Current form state. For a field in a form group, flags and submission
counters describe that group. `values` and `errors` describe the whole form.
