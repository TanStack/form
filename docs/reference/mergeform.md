# Function: mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **baseForm**: [`FormApi`](Class.FormApi.md)\<`TFormData`, `TFormValidator`\>

• **state**: `Partial`\<[`FormState`](Type.FormState.md)\<`TFormData`\>\>

## Returns

[`FormApi`](Class.FormApi.md)\<`TFormData`, `TFormValidator`\>

## Source

[packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/form-core/src/mergeForm.ts#L36)
