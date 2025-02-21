---
id: mergeForm
title: mergeForm
---

# Function: mergeForm()

```ts
function mergeForm<TFormData>(baseForm, state): FormApi<NoInfer<TFormData>, any, any, any, any, any, any, any, any>
```

Defined in: [packages/form-core/src/mergeForm.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/mergeForm.ts#L74)

## Type Parameters

• **TFormData**

## Parameters

### baseForm

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

### state

`Partial`\<[`FormState`](../type-aliases/formstate.md)\<`TFormData`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>\>

## Returns

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>
