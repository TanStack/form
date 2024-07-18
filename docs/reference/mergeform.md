---
id: mergeForm
title: mergeForm
---

# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **baseForm**: [`FormApi`](formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

• **state**: `Partial`\<[`FormState`](formstate.md)\<`TFormData`\>\>

## Returns

[`FormApi`](formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

## Defined in

[packages/form-core/src/mergeForm.ts:37](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/form-core/src/mergeForm.ts#L37)
