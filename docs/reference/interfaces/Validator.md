---
id: Validator
title: Validator
---

Defined in: [validation.public.ts:54](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L54)

Configures validation for a form, form group, or field.

## Extends

- [`BaseValidator`](BaseValidator.md)\<`TValidator`\>

## Extended by

- [`FormGroupValidator`](FormGroupValidator.md)
- [`FieldValidator`](FieldValidator.md)

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidator

`TValidator` *extends* 
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)
  \| [`ValidatorFn`](../type-aliases/ValidatorFn.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TContextValue

`TContextValue`

Library-managed. Do not specify explicitly.

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md) = [`ValidatorTrigger`](../type-aliases/ValidatorTrigger.md)

Library-managed. Do not specify explicitly.

### TScope

`TScope` *extends* [`ValidatorScope`](../type-aliases/ValidatorScope.md) = [`ValidatorScope`](../type-aliases/ValidatorScope.md)

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

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`bailIfInvalid`](BaseValidator.md#bailifinvalid)

***

### run

```ts
run: TValidator;
```

Defined in: [validation.public.ts:34](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L34)

The function or Standard Schema that validates the value in this validator's scope.

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### skipOnSubmit?

```ts
optional skipOnSubmit?: 
  | boolean
| ValidationPredicateFn<TFormData, TContextValue, TScope>;
```

Defined in: [validation.public.ts:69](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L69)

Whether this validator runs during a submission attempt, independently of `triggers`.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to skip it for the current attempt.

#### Default

```ts
false
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ValidationDebounceFn<TFormData, TContextValue, TScope>;
```

Defined in: [validation.public.ts:80](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L80)

The delay in milliseconds before validation runs for change or blur events.

Pass a number for a fixed delay, or pass a function that returns the delay
for the current event. Repeated events restart the delay.
Submission validation runs immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ValidationTriggerOption<TFormData, TContextValue, TTrigger, TScope>[];
```

Defined in: [validation.public.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L88)

Mount, change, and blur events that can run this validator, optionally with conditions.

An empty array disables mount, change, and blur validation. Configure
submission separately with `skipOnSubmit`.
