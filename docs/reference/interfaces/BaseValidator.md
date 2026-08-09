---
id: BaseValidator
title: BaseValidator
---

# Interface: BaseValidator\<TValidator\>

Defined in: [validation.public.ts:11](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L11)

## Extended by

- [`Validator`](Validator.md)
- [`FormValidator`](FormValidator.md)

## Type Parameters

### TValidator

`TValidator` *extends* 
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)
  \| [`ValidatorFn`](../type-aliases/ValidatorFn.md)\<`any`, `any`\>

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid?: boolean;
```

Defined in: [validation.public.ts:21](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L21)

If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
If `false`, validators run regardless of earlier validation results.

#### Default

```ts
false
```

***

### run

```ts
run: TValidator;
```

Defined in: [validation.public.ts:14](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L14)
