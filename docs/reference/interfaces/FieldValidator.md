---
id: FieldValidator
title: FieldValidator
---

# Interface: FieldValidator\<TFormData, TFieldName, TFieldValue\>

Defined in: [validation.public.ts:508](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L508)

## Extends

- [`Validator`](Validator.md)\<`TFormData`, 
  \| [`FieldValidatorFn`](../type-aliases/FieldValidatorFn.md)\<`TFormData`, `TFieldName`, `TFieldValue`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFieldValue`, `any`\>, `TFieldValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md), `"field"`\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid?: boolean;
```

Defined in: [validation.public.ts:21](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L21)

If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
If `false`, validators run regardless of earlier validation results.

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

Defined in: [validation.public.ts:14](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`Validator`](Validator.md).[`run`](Validator.md#run)

***

### runOnMount?

```ts
optional runOnMount?: boolean;
```

Defined in: [validation.public.ts:45](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L45)

Whether this validator should be called once when the form is constructed.

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
| ValidationPredicateFn<TFormData, TFieldValue, "field">;
```

Defined in: [validation.public.ts:38](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L38)

TODO docs

Whether this validator should be called during a submission attempt.

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
| ValidationDebounceFn<TFormData, TFieldValue, "field">;
```

Defined in: [validation.public.ts:52](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L52)

The debounce time in milliseconds for validation triggers (change, blur).
Does not affect submit events, which always execute immediately.

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

Defined in: [validation.public.ts:54](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L54)

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)

***

### watchFields?

```ts
optional watchFields?: DeepKeys<TFormData>[];
```

Defined in: [validation.public.ts:520](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L520)
