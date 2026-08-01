---
id: FormValidator
title: FormValidator
---

# Interface: FormValidator\<TFormData\>

Defined in: [validation.public.ts:447](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L447)

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

Defined in: [validation.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L21)

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

Defined in: [validation.public.ts:14](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### runOnMount?

```ts
optional runOnMount: boolean;
```

Defined in: [validation.public.ts:451](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L451)

***

### runOnSubmit?

```ts
optional runOnSubmit: 
  | boolean
| ValidationPredicateFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:450](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L450)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ValidationDebounceFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:452](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L452)

***

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TFormData, "form">[];
```

Defined in: [validation.public.ts:455](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L455)
