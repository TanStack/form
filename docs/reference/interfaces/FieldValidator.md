---
id: FieldValidator
title: FieldValidator
---

Defined in: [validation.public.ts:702](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L702)

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
  | FieldValidatorFn<TFormData, TFieldName, TFieldValue>
| StandardSchemaV1<TFieldValue, any>;
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
| ValidationPredicateFn<TFormData, TFieldValue, "field">;
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
| ValidationDebounceFn<TFormData, TFieldValue, "field">;
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
  | ValidationTriggerConfig<TFormData, TFieldValue, "change", "field">
  | ValidationTriggerConfig<TFormData, TFieldValue, "blur", "field">
  | ValidationTriggerConfig<TFormData, TFieldValue, "mount", "field">)[];
```

Defined in: [validation.public.ts:88](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L88)

Mount, change, and blur events that can run this validator, optionally with conditions.

An empty array disables mount, change, and blur validation. Configure
submission separately with `skipOnSubmit`.

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)

***

### watchFields?

```ts
optional watchFields?: DeepKeys<TFormData>[];
```

Defined in: [validation.public.ts:720](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L720)

Other field paths whose change or blur events can run this validator.

Events must still match an enabled entry in `triggers`. The validator
receives its own field's value, even when a watched field caused the event.
