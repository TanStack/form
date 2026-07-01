---
id: ValidatorOptions
title: ValidatorOptions
---

# Type Alias: ValidatorOptions\<TFormData, TContextValue, TTrigger\>

```ts
type ValidatorOptions<TFormData, TContextValue, TTrigger> = Omit<Validator<TFormData, 
  | StandardSchemaV1<any, any>
  | ValidatorFn<any, any>, TContextValue, TTrigger>, "run" | "triggers"> & object;
```

Defined in: [packages/form-core/src/validation.public.ts:54](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L54)

## Type Declaration

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TContextValue>[];
```

## Type Parameters

### TFormData

`TFormData`

### TContextValue

`TContextValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)
