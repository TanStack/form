# Function: createServerValidate()

```ts
function createServerValidate<TFormData, TFormValidator>(defaultOpts?): ValidateFormData<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **defaultOpts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`ValidateFormData`\<`TFormData`, `TFormValidator`\>

## Source

[createServerValidate.ts:40](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/react-form/src/createServerValidate.ts#L40)
