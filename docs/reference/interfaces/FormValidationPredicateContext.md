---
id: FormValidationPredicateContext
title: FormValidationPredicateContext
---

# Interface: FormValidationPredicateContext\<TFormData\>

Defined in: [packages/form-core/src/validation.public.ts:273](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L273)

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

Defined in: [packages/form-core/src/validation.public.ts:269](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L269)

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
formApi: FormApi<TFormData, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:262](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L262)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi: undefined;
```

Defined in: [packages/form-core/src/validation.public.ts:276](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L276)

***

### scope

```ts
scope: "form";
```

Defined in: [packages/form-core/src/validation.public.ts:261](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L261)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFormData;
```

Defined in: [packages/form-core/src/validation.public.ts:270](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L270)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
