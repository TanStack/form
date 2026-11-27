---
id: FormGroupValidationPredicateContext
title: FormGroupValidationPredicateContext
---

Defined in: [pipeline/validation/validation.public.ts:301](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L301)

Current form group state available to validator conditions and delay callbacks.

## Extends

- `BaseValidationPredicateContext`\<`any`, `TGroupValue`, `"group"`\>

## Type Parameters

### TGroupValue

`TGroupValue`

Library-managed. Do not specify explicitly.

## Properties

### fieldApi?

```ts
optional fieldApi?: AnyFieldApi;
```

Defined in: [pipeline/validation/validation.public.ts:280](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L280)

The field associated with the validation event, when available.

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

Defined in: [pipeline/validation/validation.public.ts:273](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L273)

The owning form, including its complete values and state.

#### Inherited from

```ts
BaseValidationPredicateContext.formApi
```

***

### groupApi

```ts
groupApi: FormGroupApi<any, any, TGroupValue, any, any>;
```

Defined in: [pipeline/validation/validation.public.ts:305](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L305)

The form group whose value is being validated.

***

### scope

```ts
scope: "group";
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
value: TGroupValue;
```

Defined in: [pipeline/validation/validation.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L282)

The current value in this validator's scope when the callback is evaluated.

#### Inherited from

```ts
BaseValidationPredicateContext.value
```
