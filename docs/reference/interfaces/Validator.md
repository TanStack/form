---
id: Validator
title: Validator
---

# Interface: Validator\<TFormData, TValidator, TContextValue, TTrigger, TScope\>

Defined in: [validation.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L24)

## Extends

- [`BaseValidator`](BaseValidator.md)\<`TValidator`\>

## Extended by

- [`FormGroupValidator`](FormGroupValidator.md)
- [`FieldValidator`](FieldValidator.md)

## Type Parameters

### TFormData

`TFormData`

### TValidator

`TValidator` *extends* 
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)
  \| [`ValidatorFn`](../type-aliases/ValidatorFn.md)\<`any`, `any`\>

### TContextValue

`TContextValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md) = [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md)

### TScope

`TScope` *extends* [`ValidatorScope`](../type-aliases/ValidatorScope.md) = [`ValidatorScope`](../type-aliases/ValidatorScope.md)

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

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`bailIfInvalid`](BaseValidator.md#bailifinvalid)

***

### run

```ts
run: TValidator;
```

Defined in: [validation.public.ts:14](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### runOnMount?

```ts
optional runOnMount?: boolean;
```

Defined in: [validation.public.ts:45](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L45)

Whether this validator should be called once when the form is constructed.

#### Default

```ts
false
```

***

### runOnSubmit?

```ts
optional runOnSubmit?: 
  | boolean
| ValidationPredicateFn<TFormData, TContextValue, TScope>;
```

Defined in: [validation.public.ts:38](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L38)

TODO docs

Whether this validator should be called during a submission attempt.

#### Default

```ts
true
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ValidationDebounceFn<TFormData, TContextValue, TScope>;
```

Defined in: [validation.public.ts:52](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L52)

The debounce time in milliseconds for validation triggers (change, blur).
Does not affect submit events, which always execute immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ValidationTriggerOption<TFormData, TContextValue, TTrigger, TScope>[];
```

Defined in: [validation.public.ts:54](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L54)
