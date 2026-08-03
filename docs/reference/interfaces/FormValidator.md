---
id: FormValidator
title: FormValidator
---

# Interface: FormValidator\<TFormData\>

Defined in: [validation.public.ts:443](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L443)

## Extends

- [`BaseValidator`](BaseValidator.md)\<
  \| [`FormValidatorFn`](../type-aliases/FormValidatorFn.md)\<`TFormData`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFormData`, `any`\>\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### bailIfInvalid?

```ts
optional bailIfInvalid: boolean;
```

Defined in: [validation.public.ts:21](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L21)

If `true`, this validator and all subsequent validators will be skipped if any previous validator has failed.
If `false`, validators run regardless of earlier validation results.

#### Default

```ts
false
```

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`bailIfInvalid`](BaseValidator.md#bailifinvalid)

***

### run

```ts
run: 
  | FormValidatorFn<TFormData>
| StandardSchemaV1<TFormData, any>;
```

Defined in: [validation.public.ts:14](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L14)

#### Inherited from

[`BaseValidator`](BaseValidator.md).[`run`](BaseValidator.md#run)

***

### runOnMount?

```ts
optional runOnMount: boolean;
```

Defined in: [validation.public.ts:447](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L447)

***

### runOnSubmit?

```ts
optional runOnSubmit: 
  | boolean
| ValidationPredicateFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:446](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L446)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ValidationDebounceFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:448](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L448)

***

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TFormData, "form">[];
```

Defined in: [validation.public.ts:450](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L450)
