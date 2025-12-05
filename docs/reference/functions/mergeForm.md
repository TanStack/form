---
id: mergeForm
title: mergeForm
---

# Function: mergeForm()

```ts
function mergeForm<TFormData>(baseForm, state): FormApi<NoInfer<TFormData>, any, any, any, any, any, any, any, any, any, any, any>;
```

Defined in: [packages/form-core/src/mergeForm.ts:73](https://github.com/TanStack/form/blob/main/packages/form-core/src/mergeForm.ts#L73)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### baseForm

[`FormApi`](../classes/FormApi.md)\<`NoInfer`\<`TFormData`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

### state

`Partial`\<[`FormApi`](../classes/FormApi.md)\<`TFormData`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>\[`"state"`\]\>

## Returns

[`FormApi`](../classes/FormApi.md)\<`NoInfer`\<`TFormData`\>, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>
