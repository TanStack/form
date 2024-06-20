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

[packages/form-core/src/formOptions.ts:4](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/form-core/src/formOptions.ts#L4)
