---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

# Interface: FieldValidationPredicateContext\<TFormData, TFieldValue\>

Defined in: [packages/form-core/src/validation.public.ts:298](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L298)

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

Defined in: [packages/form-core/src/validation.public.ts:304](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L304)

The field being validated.

#### Overrides

```ts
BaseValidationPredicateContext.fieldApi
```

***

### formApi

```ts
formApi: FormApi<TFormData, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:275](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L275)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi: undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:302](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L302)

***

### scope

```ts
scope: "field";
```

Defined in: [packages/form-core/src/validation.public.ts:274](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L274)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFieldValue;
```

Defined in: [packages/form-core/src/validation.public.ts:283](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L283)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
