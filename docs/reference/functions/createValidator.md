---
id: createValidator
title: createValidator
---

# Function: createValidator()

```ts
function createValidator<TOptions>(options): <TValidator>(run) => ValidatorWithRun<InferFormDataFromValidator<TValidator>, InferFormDataFromValidator<TValidator>, TOptions, TValidator>;
```

Defined in: [packages/form-core/src/validation.public.ts:116](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L116)

## Type Parameters

### TOptions

`TOptions` *extends* [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`any`, `any`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)\>

## Parameters

### options

`TOptions`

## Returns

```ts
<TValidator>(run): ValidatorWithRun<InferFormDataFromValidator<TValidator>, InferFormDataFromValidator<TValidator>, TOptions, TValidator>;
```

### Type Parameters

#### TValidator

`TValidator` *extends* `ValidatorRun`

### Parameters

#### run

`TValidator`

### Returns

`ValidatorWithRun`\<`InferFormDataFromValidator`\<`TValidator`\>, `InferFormDataFromValidator`\<`TValidator`\>, `TOptions`, `TValidator`\>
