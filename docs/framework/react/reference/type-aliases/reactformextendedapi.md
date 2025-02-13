---
id: ReactFormExtendedApi
title: ReactFormExtendedApi
---

# Type Alias: ReactFormExtendedApi\<TFormData, TFormValidator, TFormSubmitMeta\>

```ts
type ReactFormExtendedApi<TFormData, TFormValidator, TFormSubmitMeta> = FormApi<TFormData, TFormValidator, TFormSubmitMeta> & ReactFormApi<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/react-form/src/useForm.tsx:35](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L35)

An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TFormSubmitMeta** = `never`
