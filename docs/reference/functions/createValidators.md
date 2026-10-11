---
id: createValidators
title: createValidators
---

```ts
function createValidators<TFormData, TContextValue, TOptions>(options): <TRuns>(...runs) => ValidatorsFromOptionsAndRuns<TFormData, TContextValue, TOptions, TRuns>;
```

Defined in: [validation.public.ts:225](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L225)

Creates a reusable configuration for an ordered set of validators.

## Type Parameters

### TFormData

`TFormData` = `any`

Library-managed. Do not specify explicitly.

### TContextValue

`TContextValue` = `TFormData`

Library-managed. Do not specify explicitly.

### TOptions

`TOptions` *extends* readonly \[[`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TFormData`, `TContextValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>, [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TFormData`, `TContextValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>\] = readonly \[[`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TFormData`, `TContextValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>, [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TFormData`, `TContextValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>\]

Library-managed. Do not specify explicitly.

## Parameters

### options

`TOptions`

A nonempty tuple of configurations, one per validator.

## Returns

A function that accepts one validation function or Standard Schema
per configuration, in the same order. Its `TRuns` type argument is library-managed.
Do not specify it explicitly.

\<`TRuns`\>(...`runs`) => `ValidatorsFromOptionsAndRuns`\<`TFormData`, `TContextValue`, `TOptions`, `TRuns`\>

## Example

```ts
const withChecks = createValidators([
  { triggers: ['change'] },
  { triggers: ['blur'], bailIfInvalid: true },
])
const validators = withChecks(schema, () => 'Additional check failed')
```
