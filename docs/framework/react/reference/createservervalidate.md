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

[createServerValidate.ts:40](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/react-form/src/createServerValidate.ts#L40)
