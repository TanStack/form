# Function: createForm()

```ts
function createForm<TParentData, TFormValidator>(opts?): FormApi<TParentData, TFormValidator> & SolidFormApi<TParentData, TFormValidator>
```

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

## Parameters

• **opts?**

## Returns

`FormApi`\<`TParentData`, `TFormValidator`\> & `SolidFormApi`\<`TParentData`, `TFormValidator`\>

## Defined in

[createForm.tsx:29](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/solid-form/src/createForm.tsx#L29)
