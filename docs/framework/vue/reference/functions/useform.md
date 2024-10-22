---
id: useForm
title: useForm
---

# Function: useForm()

```ts
function useForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator> & VueFormApi<TFormData, TFormValidator>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\> & [`VueFormApi`](../interfaces/vueformapi.md)\<`TFormData`, `TFormValidator`\>

## Defined in

[useForm.tsx:30](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L30)
