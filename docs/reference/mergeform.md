# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<NoInfer<TFormData>, NoInfer<TFormValidator>>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **baseForm**: [`FormApi`](formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

• **state**: `Partial`\<[`FormState`](formstate.md)\<`TFormData`\>\>

## Returns

[`FormApi`](formapi.md)\<`NoInfer`\<`TFormData`\>, `NoInfer`\<`TFormValidator`\>\>

## Source

[packages/form-core/src/mergeForm.ts:37](https://github.com/TanStack/form/blob/5c94fa159313e0b0411d49fbdc3b117336185e63/packages/form-core/src/mergeForm.ts#L37)
