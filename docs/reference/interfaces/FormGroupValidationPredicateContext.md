---
id: FormGroupValidationPredicateContext
title: FormGroupValidationPredicateContext
---

# Interface: FormGroupValidationPredicateContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:292](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L292)

## Extends

- `BaseValidationPredicateContext`\<`any`, `TGroupValue`, `"group"`\>

## Type Parameters

### TGroupValue

`TGroupValue`

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
formApi: FormApi<any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:275](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L275)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:295](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L295)

***

### scope

```ts
scope: "group";
```

Defined in: [packages/form-core/src/validation.public.ts:274](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L274)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:283](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L283)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
