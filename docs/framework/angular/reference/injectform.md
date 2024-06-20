# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\>

## Source

[inject-form.ts:4](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/angular-form/src/inject-form.ts#L4)
