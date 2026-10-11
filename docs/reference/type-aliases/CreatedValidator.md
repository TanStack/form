---
id: CreatedValidator
title: CreatedValidator
---

```ts
type CreatedValidator<TOptions, TRun> = ValidatorWithRun<InferFormDataFromValidator<TRun>, InferFormDataFromValidator<TRun>, TOptions, TRun>;
```

Defined in: [validation.public.ts:140](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L140)

A validator created by combining reusable options with a validation function
or Standard Schema through `createValidator`.

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](ValidatorOptions.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TRun

`TRun` *extends* `ValidatorRun`

Library-managed. Do not specify explicitly.
