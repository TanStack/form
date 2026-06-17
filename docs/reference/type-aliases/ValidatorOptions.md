---
id: ValidatorOptions
title: ValidatorOptions
---

# Type Alias: ValidatorOptions\<TFormData, TContextValue\>

```ts
type ValidatorOptions<TFormData, TContextValue> = Omit<Validator<TFormData, 
  | StandardSchemaV1<any, any>
| ValidatorFn<any, any>, TContextValue>, "run">;
```

Defined in: [validation.public.ts:48](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L48)

## Type Parameters

### TFormData

`TFormData`

### TContextValue

`TContextValue`
