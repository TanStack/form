# Function: useForm()

```ts
function useForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\>

## Source

[packages/vue-form/src/useForm.tsx:30](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/vue-form/src/useForm.tsx#L30)
