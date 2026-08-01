---
id: FormGroupValidationPredicateContext
title: FormGroupValidationPredicateContext
---

# Interface: FormGroupValidationPredicateContext\<TGroupValue\>

Defined in: [packages/form-core/src/validation.public.ts:279](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L279)

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
formApi: FormApi<any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:262](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L262)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [packages/form-core/src/validation.public.ts:282](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L282)

***

### scope

```ts
scope: "group";
```

Defined in: [packages/form-core/src/validation.public.ts:261](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L261)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TGroupValue;
```

Defined in: [packages/form-core/src/validation.public.ts:270](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L270)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
