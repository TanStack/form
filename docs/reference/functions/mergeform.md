---
id: mergeForm
title: mergeForm
---

# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator, TFormSubmitMeta>(baseForm, state): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>, NoInfer<TFormSubmitMeta>>
```

Defined in: [packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/main/packages/form-core/src/mergeForm.ts#L36)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** *extends* `object` = `never`

## Parameters

### baseForm

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>, `NoInfer`\<`TFormSubmitMeta`\>\>

### state

`Partial`\<[`FormState`](../type-aliases/formstate.md)\<`TFormData`\>\>

## Returns

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>, `NoInfer`\<`TFormSubmitMeta`\>\>
