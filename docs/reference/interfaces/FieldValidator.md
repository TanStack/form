---
id: FieldValidator
title: FieldValidator
---

# Interface: FieldValidator\<TFormData, TFieldName, TFieldValue\>

Defined in: [validation.public.ts:401](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L401)

## Extends

- [`Validator`](Validator.md)\<`TFormData`, 
  \| [`FieldValidatorFn`](../type-aliases/FieldValidatorFn.md)\<`TFormData`, `TFieldName`, `TFieldValue`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFieldValue`, `any`\>, `TFieldValue`\>

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
optional bailIfInvalid: boolean;
```

Defined in: [validation.public.ts:23](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L23)

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

Defined in: [validation.public.ts:16](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L16)

#### Inherited from

[`Validator`](Validator.md).[`run`](Validator.md#run)

***

### runOnMount?

```ts
optional runOnMount: boolean;
```

Defined in: [validation.public.ts:37](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L37)

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
optional runOnSubmit: 
  | boolean
| ValidationPredicateFn<TFormData, TFieldValue>;
```

Defined in: [validation.public.ts:31](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L31)

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
optional triggerDebounceMs: 
  | number
| ValidationDebounceFn<TFormData, TFieldValue>;
```

Defined in: [validation.public.ts:44](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L44)

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
triggers: ValidationTriggerOption<TFormData, TFieldValue>[];
```

Defined in: [validation.public.ts:45](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L45)

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)

***

### watchFields?

```ts
optional watchFields: DeepKeys<TFormData>[];
```

Defined in: [validation.public.ts:411](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L411)
