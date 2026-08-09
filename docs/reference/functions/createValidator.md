---
id: createValidator
title: createValidator
---

# Function: createValidator()

```ts
function createValidator<TOptions>(options): <TValidator>(run) => ValidatorWithRun<InferFormDataFromValidator<TValidator>, InferFormDataFromValidator<TValidator>, TOptions, TValidator>;
```

Defined in: [validation.public.ts:123](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L123)

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`any`, `any`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>

## Parameters

### options

`TOptions`

## Returns

\<`TValidator`\>(`run`) => `ValidatorWithRun`\<`InferFormDataFromValidator`\<`TValidator`\>, `InferFormDataFromValidator`\<`TValidator`\>, `TOptions`, `TValidator`\>
