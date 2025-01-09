---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TParentData, TFormValidator>(opts?): FormApi<TParentData, TFormValidator, undefined, undefined, undefined, undefined, undefined, undefined, undefined> & SolidFormApi<TParentData, TFormValidator>
```

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

## Parameters

### opts?

() => `FormOptions`\<`TParentData`, `TFormValidator`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`\>

## Returns

`FormApi`\<`TParentData`, `TFormValidator`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`, `undefined`\> & [`SolidFormApi`](../interfaces/solidformapi.md)\<`TParentData`, `TFormValidator`\>

## Defined in

[packages/solid-form/src/createForm.tsx:26](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L26)
