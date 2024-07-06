# Function: useForm()

```ts
function useForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator> & VueFormApi<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\> & `VueFormApi`\<`TFormData`, `TFormValidator`\>

## Source

[packages/vue-form/src/useForm.tsx:30](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/vue-form/src/useForm.tsx#L30)
