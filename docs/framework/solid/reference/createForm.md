# Function: createForm()

```ts
function createForm<TParentData, TFormValidator>(opts?): FormApi<TParentData, TFormValidator> & SolidFormApi<TParentData, TFormValidator>
```

## Type parameters

• **TParentData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

## Parameters

• **opts?**

## Returns

`FormApi`\<`TParentData`, `TFormValidator`\> & `SolidFormApi`\<`TParentData`, `TFormValidator`\>

## Source

[createForm.tsx:29](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/solid-form/src/createForm.tsx#L29)
