---
id: CreatedValidator
title: CreatedValidator
---

# Type Alias: CreatedValidator\<TOptions, TRun\>

```ts
type CreatedValidator<TOptions, TRun> = ValidatorWithRun<InferFormDataFromValidator<TRun>, InferFormDataFromValidator<TRun>, TOptions, TRun>;
```

Defined in: [validation.public.ts:107](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L107)

The validator produced by applying a run function or Standard Schema to a
reusable `createValidator` configuration.

This type is inferred from `createValidator`; application code normally
does not need to name it directly.

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](ValidatorOptions.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TRun

`TRun` *extends* `ValidatorRun`

Library-managed. Do not specify explicitly.
