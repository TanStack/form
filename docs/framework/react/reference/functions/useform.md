---
id: useForm
title: useForm
---

# Function: useForm()

```ts
function useForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator> & ReactFormApi<TFormData, TFormValidator>
```

A custom React Hook that returns an extended instance of the `FormApi` class.

This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\> & [`ReactFormApi`](../interfaces/reactformapi.md)\<`TFormData`, `TFormValidator`\>

## Defined in

[useForm.tsx:56](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/react-form/src/useForm.tsx#L56)
