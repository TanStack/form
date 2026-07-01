---
id: FormGroupValidator
title: FormGroupValidator
---

# Interface: FormGroupValidator\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:459](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L459)

## Extends

- [`Validator`](Validator.md)\<`TGroupValue`, 
  \| [`FormGroupValidatorFn`](../type-aliases/FormGroupValidatorFn.md)\<`TGroupValue`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TGroupValue`, `any`\>, `TGroupValue`, [`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)\>

## Type Parameters

### TGroupValue

`TGroupValue`

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid: boolean;
```

Defined in: [packages/form-core/src/validation.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L21)

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
  | FormGroupValidatorFn<TGroupValue>
| StandardSchemaV1<TGroupValue, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:14](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`Validator`](Validator.md).[`run`](Validator.md#run)

***

### runOnMount?

```ts
optional runOnMount: boolean;
```

Defined in: [packages/form-core/src/validation.public.ts:43](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L43)

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
| ValidationPredicateFn<TGroupValue, TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:37](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L37)

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
| ValidationDebounceFn<TGroupValue, TGroupValue>;
```

Defined in: [packages/form-core/src/validation.public.ts:50](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L50)

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
triggers: ValidationTriggerOption<TGroupValue, TGroupValue, ConfigurableValidationTrigger>[];
```

Defined in: [packages/form-core/src/validation.public.ts:51](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L51)

#### Inherited from

[`Validator`](Validator.md).[`triggers`](Validator.md#triggers)
