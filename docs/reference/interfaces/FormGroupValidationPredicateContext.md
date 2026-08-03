---
id: FormGroupValidationPredicateContext
title: FormGroupValidationPredicateContext
---

# Interface: FormGroupValidationPredicateContext\<TGroupValue\>

Defined in: [validation.public.ts:277](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L277)

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
formApi: FormApi<any, any>;
```

Defined in: [validation.public.ts:260](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L260)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [validation.public.ts:280](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L280)

***

### scope

```ts
scope: "group";
```

Defined in: [validation.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L259)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TGroupValue;
```

Defined in: [validation.public.ts:268](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L268)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
