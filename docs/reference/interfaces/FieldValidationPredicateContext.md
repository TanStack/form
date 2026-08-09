---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

# Interface: FieldValidationPredicateContext\<TFormData, TFieldValue\>

Defined in: [validation.public.ts:283](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L283)

## Extends

- `BaseValidationPredicateContext`\<`TFormData`, `TFieldValue`, `"field"`\>

## Type Parameters

### TFormData

`TFormData`

### TFieldValue

`TFieldValue`

## Properties

### fieldApi

```ts
fieldApi: AnyFieldApi;
```

Defined in: [validation.public.ts:289](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L289)

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

Defined in: [validation.public.ts:260](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L260)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi?: undefined;
```

Defined in: [validation.public.ts:287](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L287)

***

### scope

```ts
scope: "field";
```

Defined in: [validation.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L259)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:268](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L268)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
