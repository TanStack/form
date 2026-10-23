---
id: Validator
title: Validator
---

Defined in: [validation.public.ts:41](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L41)

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

Defined in: [validation.public.ts:29](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L29)

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

Defined in: [validation.public.ts:21](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L21)

The function or Standard Schema that validates the value in this validator's scope.

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### runOnMount?

```ts
optional runOnMount?: boolean;
```

Defined in: [validation.public.ts:64](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L64)

Whether this validator runs when the form is constructed or when its field
or form group first mounts.

#### Default

```ts
false
```

***

### skipOnSubmit?

```ts
optional skipOnSubmit?: 
  | boolean
| ValidationPredicateFn<TFormData, TContextValue, TScope>;
```

Defined in: [validation.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L56)

Whether this validator runs during a submission attempt, independently of `triggers`.

Pass a boolean directly, or pass a function that returns
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

Defined in: [validation.public.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L74)

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

Defined in: [validation.public.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L82)

Change and blur events that can run this validator, optionally with conditions.

An empty array disables change and blur validation. Configure submission
separately with `skipOnSubmit` and initial validation with `runOnMount`.
