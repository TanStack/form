---
id: FormValidationPredicateContext
title: FormValidationPredicateContext
---

Defined in: [pipeline/validation/validation.public.ts:286](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L286)

Current form state available to validator conditions and delay callbacks.

## Extends

- `BaseValidationPredicateContext`\<`TFormData`, `TFormData`, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### fieldApi?

```ts
optional fieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/validation.public.ts:276](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L276)

The field associated with the validation event, when available.

For form and group validators, this is the field that triggered the
validation. For field validators, this is the field being validated.

#### Inherited from

```ts
BaseValidationPredicateContext.fieldApi
```

***

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [pipeline/validation/validation.public.ts:269](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L269)

The owning form, including its complete values and state.

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi?: undefined;
```

Defined in: [pipeline/validation/validation.public.ts:289](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L289)

***

### scope

```ts
scope: "form";
```

Defined in: [pipeline/validation/validation.public.ts:267](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L267)

Identifies whether `value` belongs to a form, form group, or field.

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFormData;
```

Defined in: [pipeline/validation/validation.public.ts:278](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L278)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
