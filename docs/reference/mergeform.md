# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **baseForm**: [`FormApi`](Class.FormApi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

• **state**: `Partial`\<[`FormState`](Type.FormState.md)\<`TFormData`\>\>

## Returns

[`FormApi`](Class.FormApi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

## Source

[packages/form-core/src/mergeForm.ts:37](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/mergeForm.ts#L37)
