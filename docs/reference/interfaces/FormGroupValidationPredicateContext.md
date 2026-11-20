---
id: FormGroupValidationPredicateContext
title: FormGroupValidationPredicateContext
---

Defined in: [validation.public.ts:350](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L350)

Current form group state available to validator conditions and delay callbacks.

## Extends

- `BaseValidationPredicateContext`\<`any`, `TGroupValue`, `"group"`\>

## Type Parameters

### TGroupValue

`TGroupValue`

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
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L322)

The owning form, including its complete values and state.

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:354](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L354)

The form group whose value is being validated.

***

### scope

```ts
scope: "group";
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
value: TGroupValue;
```

Defined in: [validation.public.ts:331](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L331)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
