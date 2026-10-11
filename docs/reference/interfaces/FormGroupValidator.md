---
id: FormGroupValidator
title: FormGroupValidator
---

Defined in: [validation.public.ts:918](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L918)

Configures validation of a form group's value.

## Extends

- [`Validator`](Validator.md)\<`TGroupValue`, 
  \| [`FormGroupValidatorFn`](../type-aliases/FormGroupValidatorFn.md)\<`TGroupValue`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TGroupValue`, `any`\>, `TGroupValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), `"group"`\>

## Type Parameters

### TGroupValue

`TGroupValue`

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

[`Validator`](Validator.md).[`bailIfInvalid`](Validator.md#bailifinvalid)

***

### run

```ts
run: 
  | FormGroupValidatorFn<TGroupValue>
| StandardSchemaV1<TGroupValue, any>;
```

Defined in: [validation.public.ts:21](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L21)

The function or Standard Schema that validates the value in this validator's scope.

#### Inherited from

[`Validator`](Validator.md).[`run`](Validator.md#run)

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

#### Inherited from

[`Validator`](Validator.md).[`runOnMount`](Validator.md#runonmount)

***

### runOnSubmit?

```ts
optional runOnSubmit?: 
  | boolean
| ValidationPredicateFn<TGroupValue, TGroupValue, "group">;
```

Defined in: [validation.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L56)

Whether this validator runs during a submission attempt, independently of `triggers`.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to enable it for the current attempt.

#### Default

```ts
true
```

#### Inherited from

[`Validator`](Validator.md).[`runOnSubmit`](Validator.md#runonsubmit)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ValidationDebounceFn<TGroupValue, TGroupValue, "group">;
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

#### Inherited from

[`Validator`](Validator.md).[`triggerDebounceMs`](Validator.md#triggerdebouncems)

***

### triggers

```ts
triggers: ValidationTriggerOption<TGroupValue, TGroupValue, ConfigurableValidationTrigger, "group">[];
```

Defined in: [validation.public.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L82)

Change and blur events that can run this validator, optionally with conditions.

An empty array disables change and blur validation. Configure submission
separately with `runOnSubmit` and initial validation with `runOnMount`.

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)
