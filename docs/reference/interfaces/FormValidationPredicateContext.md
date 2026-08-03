---
id: FormValidationPredicateContext
title: FormValidationPredicateContext
---

# Interface: FormValidationPredicateContext\<TFormData\>

Defined in: [validation.public.ts:271](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L271)

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

Defined in: [validation.public.ts:267](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L267)

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

Defined in: [validation.public.ts:260](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L260)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi: undefined;
```

Defined in: [validation.public.ts:274](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L274)

***

### scope

```ts
scope: "form";
```

Defined in: [validation.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L259)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFormData;
```

Defined in: [validation.public.ts:268](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L268)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
