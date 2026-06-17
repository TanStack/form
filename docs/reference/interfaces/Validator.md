---
id: Validator
title: Validator
---

# Interface: Validator\<TFormData, TValidator, TContextValue\>

Defined in: [validation.public.ts:11](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L11)

## Extended by

- [`FormValidator`](FormValidator.md)
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

***

### run

```ts
run: TValidator;
```

Defined in: [validation.public.ts:16](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L16)

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

***

### runOnSubmit?

```ts
optional runOnSubmit: 
  | boolean
| ValidationPredicateFn<TFormData, TContextValue>;
```

Defined in: [validation.public.ts:31](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L31)

TODO docs

Whether this validator should be called during a submission attempt.

#### Default

```ts
true
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ValidationDebounceFn<TFormData, TContextValue>;
```

Defined in: [validation.public.ts:44](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L44)

The debounce time in milliseconds for validation triggers (change, blur).
Does not affect submit events, which always execute immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ValidationTriggerOption<TFormData, TContextValue>[];
```

Defined in: [validation.public.ts:45](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L45)
