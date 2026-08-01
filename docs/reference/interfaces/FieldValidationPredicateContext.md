---
id: FieldValidationPredicateContext
title: FieldValidationPredicateContext
---

# Interface: FieldValidationPredicateContext\<TFormData, TFieldValue\>

Defined in: [validation.public.ts:285](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L285)

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

Defined in: [validation.public.ts:291](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L291)

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

Defined in: [validation.public.ts:262](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L262)

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi?

```ts
optional groupApi: undefined;
```

Defined in: [validation.public.ts:289](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L289)

***

### scope

```ts
scope: "field";
```

Defined in: [validation.public.ts:261](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L261)

#### Inherited from

```ts
BaseValidationPredicateContext.scope
```

***

### value

```ts
value: TFieldValue;
```

Defined in: [validation.public.ts:270](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L270)

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
