---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

Defined in: [validation.public.ts:363](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L363)

Current field state available to validator conditions and delay callbacks.

## Extends

- `BaseValidationPredicateContext`\<`TFormData`, `TFieldValue`, `"field"`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFieldValue

`TFieldValue`

Library-managed. Do not specify explicitly.

## Properties

### fieldApi

```ts
fieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:369](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L369)

The field being validated.

#### Overrides

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

Defined in: [validation.public.ts:367](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L367)

***

### scope

```ts
scope: "field";
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
value: TFieldValue;
```

Defined in: [validation.public.ts:331](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L331)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
