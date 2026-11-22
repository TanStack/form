---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

Defined in: [pipeline/validation/validation.public.ts:310](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L310)

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

Defined in: [pipeline/validation/validation.public.ts:316](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L316)

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

Defined in: [pipeline/validation/validation.public.ts:314](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L314)

***

### scope

```ts
scope: "field";
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
value: TFieldValue;
```

Defined in: [pipeline/validation/validation.public.ts:278](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L278)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
