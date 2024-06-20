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

[packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/mergeForm.ts#L36)
