---
id: ValidationTriggerConfig
title: ValidationTriggerConfig
---

# Interface: ValidationTriggerConfig\<TFormData, TValue\>

Defined in: [validation.public.ts:254](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L254)

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

## Properties

### trigger

```ts
trigger: ConfigurableValidationTrigger;
```

Defined in: [validation.public.ts:255](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L255)

***

### when?

```ts
optional when: 
  | boolean
| ValidationPredicateFn<TFormData, TValue>;
```

Defined in: [validation.public.ts:256](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L256)
