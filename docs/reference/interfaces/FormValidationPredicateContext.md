---
id: FormValidationPredicateContext
title: FormValidationPredicateContext
---

# Interface: FormValidationPredicateContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:286](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L286)

## Extends

- `BaseValidationPredicateContext`\<`TFormData`, `TFormData`, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

## Properties

### fieldApi?

```ts
optional fieldApi: AnyFieldApi;
```

Defined in: [packages/form-core/src/validation.public.ts:282](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L282)

The field associated with this validation, if any.

For form and group validators, this is the field that triggered the
validation. For field validators, this is the field being validated.

#### Inherited from

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

Defined in: [packages/form-core/src/validation.public.ts:289](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L289)

***

### scope

```ts
scope: "form";
```

Defined in: [packages/form-core/src/validation.public.ts:274](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L274)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:283](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L283)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
