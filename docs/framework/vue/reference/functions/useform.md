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

`FormApi`\<`TFormData`, `TFormValidator`\> & `VueFormApi`\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/vue-form/src/useForm.tsx:30](https://github.com/TanStack/form/blob/782e82ea1fb36627b62d0f588484b4a9c3249fed/packages/vue-form/src/useForm.tsx#L30)
