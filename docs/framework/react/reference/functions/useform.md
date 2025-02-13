---
id: useForm
title: useForm
---

# Function: useForm()

```ts
function useForm<TFormData, TFormValidator, TFormSubmitMeta>(opts?): ReactFormExtendedApi<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/react-form/src/useForm.tsx:60](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L60)

A custom React Hook that returns an extended instance of the `FormApi` class.

This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** = `never`

## Parameters

### opts?

`FormOptions`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

## Returns

[`ReactFormExtendedApi`](../type-aliases/reactformextendedapi.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>
