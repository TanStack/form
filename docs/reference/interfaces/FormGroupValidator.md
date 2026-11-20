---
id: FormGroupValidator
title: FormGroupValidator
---

Defined in: [validation.public.ts:636](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L636)

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

Defined in: [validation.public.ts:42](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L42)

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

Defined in: [validation.public.ts:34](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L34)

The function or Standard Schema that validates the value in this validator's scope.

#### Inherited from

[`Validator`](Validator.md).[`run`](Validator.md#run)

***

### skipOnSubmit?

```ts
optional skipOnSubmit?: 
  | boolean
| ValidationPredicateFn<TGroupValue, TGroupValue, "group">;
```

Defined in: [validation.public.ts:69](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L69)

Whether this validator runs during a submission attempt, independently of `triggers`.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to skip it for the current attempt.

#### Default

```ts
false
```

#### Inherited from

[`Validator`](Validator.md).[`skipOnSubmit`](Validator.md#skiponsubmit)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ValidationDebounceFn<TGroupValue, TGroupValue, "group">;
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

#### Inherited from

[`Validator`](Validator.md).[`triggerDebounceMs`](Validator.md#triggerdebouncems)

***

### triggers

```ts
triggers: (
  | "change"
  | "blur"
  | "mount"
  | ValidationTriggerConfig<TGroupValue, TGroupValue, "change", "group">
  | ValidationTriggerConfig<TGroupValue, TGroupValue, "blur", "group">
  | ValidationTriggerConfig<TGroupValue, TGroupValue, "mount", "group">)[];
```

Defined in: [validation.public.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L88)

Mount, change, and blur events that can run this validator, optionally with conditions.

An empty array disables mount, change, and blur validation. Configure
submission separately with `skipOnSubmit`.

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)
