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

[createForm.tsx:29](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/solid-form/src/createForm.tsx#L29)
