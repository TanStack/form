# Function: useForm()

```ts
function useForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator> & ReactFormApi<TFormData, TFormValidator>
```

A custom React Hook that returns an extended instance of the `FormApi` class.

This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\> & `ReactFormApi`\<`TFormData`, `TFormValidator`\>

## Source

[useForm.tsx:56](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/react-form/src/useForm.tsx#L56)
