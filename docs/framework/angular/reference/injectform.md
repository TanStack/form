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

[inject-form.ts:4](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/angular-form/src/inject-form.ts#L4)
