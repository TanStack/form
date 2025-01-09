---
id: mergeForm
title: mergeForm
---

# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>, undefined, undefined, undefined, undefined, undefined, undefined, undefined>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

### baseForm

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`\>

### state

`Partial`\<[`FormState`](../type-aliases/formstate.md)\<`TFormData`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`\>\>

## Returns

[`FormApi`](../classes/formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`\>

## Defined in

[packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/main/packages/form-core/src/mergeForm.ts#L36)
