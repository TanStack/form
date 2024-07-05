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

[packages/form-core/src/mergeForm.ts:37](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/mergeForm.ts#L37)
