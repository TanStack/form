---
id: createForm
title: createForm
---

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

[createForm.tsx:29](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/solid-form/src/createForm.tsx#L29)
