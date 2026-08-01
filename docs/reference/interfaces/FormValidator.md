---
id: FormValidator
title: FormValidator
---

# Interface: FormValidator\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:460](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L460)

## Extends

- [`BaseValidator`](BaseValidator.md)\<
  \| [`FormValidatorFn`](../type-aliases/FormValidatorFn.md)\<`TFormData`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFormData`, `any`\>\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid: boolean;
```

Defined in: [packages/form-core/src/validation.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L21)

If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
If `false`, validators run regardless of earlier validation results.

#### Default

```ts
false
```

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`bailIfInvalid`](BaseValidator.md#bailifinvalid)

***

### run

```ts
run: 
  | FormValidatorFn<TFormData>
| StandardSchemaV1<TFormData, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:14](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### runOnMount?

```ts
optional runOnMount: boolean;
```

Defined in: [packages/form-core/src/validation.public.ts:464](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L464)

***

### runOnSubmit?

```ts
optional runOnSubmit: 
  | boolean
| ValidationPredicateFn<TFormData, TFormData, "form">;
```

Defined in: [packages/form-core/src/validation.public.ts:463](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L463)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ValidationDebounceFn<TFormData, TFormData, "form">;
```

Defined in: [packages/form-core/src/validation.public.ts:465](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L465)

***

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TFormData, "form">[];
```

Defined in: [packages/form-core/src/validation.public.ts:468](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L468)
