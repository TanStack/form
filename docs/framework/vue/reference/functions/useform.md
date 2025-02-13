---
id: useForm
title: useForm
---

# Function: useForm()

```ts
function useForm<TFormData, TFormValidator, TFormSubmitMeta>(opts?): FormApi<TFormData, TFormValidator, TFormSubmitMeta> & VueFormApi<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/vue-form/src/useForm.tsx:31](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L31)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** = `never`

## Parameters

### opts?

`FormOptions`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\> & [`VueFormApi`](../interfaces/vueformapi.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>
