---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TParentData, TFormValidator, TFormSubmitMeta>(opts?): FormApi<TParentData, TFormValidator, TFormSubmitMeta> & SolidFormApi<TParentData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/solid-form/src/createForm.tsx:27](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L27)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** = `never`

## Parameters

### opts?

() => `FormOptions`\<`TParentData`, `TFormValidator`, `TFormSubmitMeta`\>

## Returns

`FormApi`\<`TParentData`, `TFormValidator`, `TFormSubmitMeta`\> & [`SolidFormApi`](../interfaces/solidformapi.md)\<`TParentData`, `TFormValidator`, `TFormSubmitMeta`\>
