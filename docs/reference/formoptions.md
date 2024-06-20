# Function: formOptions()

```ts
function formOptions<TFormData, TFormValidator>(defaultOpts?): undefined | FormOptions<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **defaultOpts?**: [`FormOptions`](Interface.FormOptions.md)\<`TFormData`, `TFormValidator`\>

## Returns

`undefined` \| [`FormOptions`](Interface.FormOptions.md)\<`TFormData`, `TFormValidator`\>

## Source

[packages/form-core/src/formOptions.ts:4](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/formOptions.ts#L4)