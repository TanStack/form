---
id: FormValidator
title: FormValidator
---

Defined in: [validation.public.ts:816](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L816)

Configures validation of complete form values on the client or server.

## Extends

- [`BaseValidator`](BaseValidator.md)\<
  \| [`FormValidatorFn`](../type-aliases/FormValidatorFn.md)\<`TFormData`\>
  \| [`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFormData`, `any`\>\>

## Type Parameters

### TFormData

`TFormData`

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
run: 
  | FormValidatorFn<TFormData>
| StandardSchemaV1<TFormData, any>;
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

Defined in: [validation.public.ts:833](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L833)

Whether this validator runs when the form is constructed.

#### Default

```ts
false
```

***

### runOnSubmit?

```ts
optional runOnSubmit?: 
  | boolean
| ValidationPredicateFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:827](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L827)

Whether this validator runs during a client submission attempt, independently of `triggers`.

Pass a boolean to enable or disable it, or pass a function that returns
`true` to enable it for the current attempt.

#### Default

```ts
true
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ValidationDebounceFn<TFormData, TFormData, "form">;
```

Defined in: [validation.public.ts:843](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L843)

The delay in milliseconds before validation runs for change or blur events.

Pass a number for a fixed delay, or pass a function that returns the delay
for the current event. Repeated events restart the delay.
Submission and server validation run immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TFormData, "form">[];
```

Defined in: [validation.public.ts:852](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L852)

Change and blur events that can run this validator, optionally with conditions.
Add `'server'` to include it in `serverValidate`.

An empty array disables change, blur, and server validation. Configure client
submission separately with `runOnSubmit` and initial validation with `runOnMount`.
