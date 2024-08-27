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

`FormApi`\<`TParentData`, `TFormValidator`\> & [`SolidFormApi`](../interfaces/solidformapi.md)\<`TParentData`, `TFormValidator`\>

## Defined in

[createForm.tsx:29](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/solid-form/src/createForm.tsx#L29)
