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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`TFormData`, [`StandardSchemaV1`](../type-aliases/standardschemav1.md)\<`TFormData`\>\>

## Parameters

### baseForm

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

### state

`Partial`\<[`FormState`](../type-aliases/formstate.md)\<`TFormData`\>\>

## Returns

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

## Defined in

[packages/form-core/src/mergeForm.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/mergeForm.ts#L37)
