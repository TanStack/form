---
id: FormOptionsOnSubmitFn
title: FormOptionsOnSubmitFn
---

```ts
type FormOptionsOnSubmitFn<TFormData, TValidatorOutputs, TSubmitReturn> = (context) => TSubmitReturn;
```

Defined in: [FormApi/formSubmit.public.ts:271](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L271)

Handles a form submission after submission validation succeeds.

Return a result from `createValidationError`, `createErrorMap`, or `parseIssues`
to report validation errors from the submission handler.

A returned promise is awaited before submission finishes.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorOutputs

`TValidatorOutputs` *extends* readonly `unknown`[]

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

## Parameters

### context

[`FormSubmitContext`](../interfaces/FormSubmitContext.md)\<`TFormData`, `TValidatorOutputs`\>

## Returns

`TSubmitReturn`
