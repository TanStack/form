---
id: FormValidatorFn
title: FormValidatorFn
---

```ts
type FormValidatorFn<TFormData, TEvents> = (context) => Awaitable<FormValidationResult<TFormData>>;
```

Defined in: [validation/formValidators.public.ts:217](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/formValidators.public.ts#L217)

Validates the complete form values with a context selected from its configured events.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TEvents

`TEvents` *extends* [`ValidatorEvents`](ValidatorEvents.md)

Library-managed. Do not specify explicitly.

## Parameters

### context

`GetValidatorContext`\<`TFormData`, `TEvents`\>

## Returns

[`Awaitable`](Awaitable.md)\<[`FormValidationResult`](FormValidationResult.md)\<`TFormData`\>\>

Form or field errors, a successful result from `createOutput`, or
`null`, `undefined`, or `false` for success without output data. The result
can also be returned in a promise.
