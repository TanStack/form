---
id: BaseValidator
title: BaseValidator
---

Defined in: [validation.public.ts:30](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L30)

A validation function or Standard Schema with an optional rule to stop after earlier failures.

## Extended by

- [`Validator`](Validator.md)

## Type Parameters

### TValidator

`TValidator` *extends* 
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)
  \| [`ValidatorFn`](../type-aliases/ValidatorFn.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid?: boolean;
```

Defined in: [validation.public.ts:42](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L42)

If `true`, skips this and subsequent validators when earlier validation has failed.

If `false`, earlier failures do not prevent this validator from running.

#### Default

```ts
false
```

***

### run

```ts
run: TValidator;
```

Defined in: [validation.public.ts:34](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L34)

The function or Standard Schema that validates the value in this validator's scope.
