---
id: createValidator
title: createValidator
---

# Function: createValidator()

```ts
function createValidator<TOptions>(options): <TValidator>(run) => CreatedValidator<TOptions, TValidator>;
```

Defined in: [validation.public.ts:143](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L143)

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`any`, `any`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), [`ValidatorScope`](../type-aliases/ValidatorScope.md)\>

## Parameters

### options

`TOptions`

## Returns

\<`TValidator`\>(`run`) => [`CreatedValidator`](../type-aliases/CreatedValidator.md)\<`TOptions`, `TValidator`\>
