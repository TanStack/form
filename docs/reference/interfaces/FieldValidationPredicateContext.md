---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

Defined in: [pipeline/validation/validation.public.ts:314](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L314)

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

Defined in: [pipeline/validation/validation.public.ts:320](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L320)

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

Defined in: [pipeline/validation/validation.public.ts:273](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L273)

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

Defined in: [pipeline/validation/validation.public.ts:318](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L318)

***

### scope

```ts
scope: "field";
```

Defined in: [pipeline/validation/validation.public.ts:271](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L271)

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

Defined in: [pipeline/validation/validation.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L282)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
