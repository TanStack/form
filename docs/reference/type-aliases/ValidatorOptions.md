---
id: ValidatorOptions
title: ValidatorOptions
---

# Type Alias: ValidatorOptions\<TFormData, TContextValue, TTrigger, TScope\>

```ts
type ValidatorOptions<TFormData, TContextValue, TTrigger, TScope> = Omit<Validator<TFormData, 
  | StandardSchemaV1<any, any>
  | ValidatorFn<any, any>, TContextValue, TTrigger, TScope>, "run" | "triggers"> & object;
```

Defined in: [validation.public.ts:59](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L59)

## Type Declaration

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TContextValue, TScope>[];
```

## Type Parameters

### TFormData

`TFormData`

### TContextValue

`TContextValue`

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)
