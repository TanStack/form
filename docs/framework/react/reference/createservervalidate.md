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

[createServerValidate.ts:40](https://github.com/TanStack/form/blob/5c94fa159313e0b0411d49fbdc3b117336185e63/packages/react-form/src/createServerValidate.ts#L40)
