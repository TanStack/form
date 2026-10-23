---
id: FieldValidator
title: FieldValidator
---

Defined in: [validation.public.ts:983](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L983)

Configures validation of a field's value, optionally reacting to related fields.

## Extends

- [`Validator`](Validator.md)\<`TFormData`, 
  \| [`FieldValidatorFn`](../type-aliases/FieldValidatorFn.md)\<`TFormData`, `TFieldName`, `TFieldValue`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFieldValue`, `any`\>, `TFieldValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), `"field"`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFieldName

`TFieldName`

Library-managed. Do not specify explicitly.

### TFieldValue

`TFieldValue`

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
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
| StandardSchemaV1<TFieldValue, any>;
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

### skipOnSubmit?

```ts
optional skipOnSubmit?: 
  | boolean
| ValidationPredicateFn<TFormData, TFieldValue, "field">;
```

Defined in: [validation.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L56)

Whether this validator runs during a submission attempt, independently of `triggers`.

Pass a boolean directly, or pass a function that returns
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
| ValidationDebounceFn<TFormData, TFieldValue, "field">;
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
triggers: ValidationTriggerOption<TFormData, TFieldValue, ConfigurableValidationTrigger, "field">[];
```

Defined in: [validation.public.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L82)

Change and blur events that can run this validator, optionally with conditions.

An empty array disables change and blur validation. Configure submission
separately with `skipOnSubmit` and initial validation with `runOnMount`.

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)

***

### watchFields?

```ts
optional watchFields?: DeepKeys<TFormData>[];
```

Defined in: [validation.public.ts:1001](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1001)

Other field paths whose change or blur events can run this validator.

Events must still match an enabled entry in `triggers`. The validator
receives its own field's value, even when a watched field caused the event.
