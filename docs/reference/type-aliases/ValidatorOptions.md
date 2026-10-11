---
id: ValidatorOptions
title: ValidatorOptions
---

```ts
type ValidatorOptions<TFormData, TContextValue, TTrigger, TScope> = Omit<Validator<TFormData, 
  | StandardSchemaV1<any, any>
  | ValidatorFn<any, any>, TContextValue, TTrigger, TScope>, "run" | "triggers"> & object;
```

Defined in: [validation.public.ts:95](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L95)

Reusable scheduling and failure-handling options for `createValidator` or `createValidators`.

## Type Declaration

### triggers

```ts
triggers: FormValidationTriggerOption<TFormData, TContextValue, TScope>[];
```

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TContextValue

`TContextValue`

Library-managed. Do not specify explicitly.

### TTrigger

`TTrigger` *extends* [`ValidatorTrigger`](ValidatorTrigger.md) = [`ValidatorTrigger`](ValidatorTrigger.md)

Library-managed. Do not specify explicitly.

### TScope

`TScope` *extends* [`ValidatorScope`](ValidatorScope.md) = [`ValidatorScope`](ValidatorScope.md)

Library-managed. Do not specify explicitly.
