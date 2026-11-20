---
id: FormValidationPredicateContext
title: FormValidationPredicateContext
---

Defined in: [validation.public.ts:339](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L339)

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

Defined in: [validation.public.ts:329](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L329)

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

Defined in: [validation.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L322)

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

Defined in: [validation.public.ts:342](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L342)

***

### scope

```ts
scope: "form";
```

Defined in: [validation.public.ts:320](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L320)

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

Defined in: [validation.public.ts:331](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L331)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
