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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`TFormData`, `StandardSchemaV1`\<`TFormData`\>\>

## Parameters

### opts?

`FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\> & [`VueFormApi`](../interfaces/vueformapi.md)\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/vue-form/src/useForm.tsx:38](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L38)
