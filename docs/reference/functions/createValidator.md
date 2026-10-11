---
id: createValidator
title: createValidator
---

```ts
function createValidator<TOptions>(options): <TValidator>(run) => CreatedValidator<TOptions, TValidator>;
```

Defined in: [validation.public.ts:195](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L195)

Creates a reusable configuration to apply to validation functions or Standard Schemas.

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`any`, `any`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>

Library-managed. Do not specify explicitly.

## Parameters

### options

`TOptions`

## Returns

A function that combines `options` with its `run` argument, preserving
the validator's inferred types. Its `TValidator` type argument is library-managed.
Do not specify it explicitly.

\<`TValidator`\>(`run`) => [`CreatedValidator`](../type-aliases/CreatedValidator.md)\<`TOptions`, `TValidator`\>

## Example

```ts
const afterSubmit = createValidator({
  triggers: [{
    trigger: 'change',
    when: ({ formApi }) => formApi.state.submissionAttempts > 0,
  }],
})
const validators = [afterSubmit(schema)]
```
