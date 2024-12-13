---
id: ReactFormExtendedApi
title: ReactFormExtendedApi
---

# Type Alias: ReactFormExtendedApi\<TFormData, TFormValidator\>

```ts
type ReactFormExtendedApi<TFormData, TFormValidator>: FormApi<TFormData, TFormValidator> & ReactFormApi<TFormData, TFormValidator>;
```

An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`TFormData`, `StandardSchemaV1`\<`TFormData`\>\>

## Defined in

[packages/react-form/src/useForm.tsx:42](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L42)
