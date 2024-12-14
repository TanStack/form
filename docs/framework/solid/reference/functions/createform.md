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

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

## Parameters

### opts?

() => `FormOptions`\<`TParentData`, `TFormValidator`\>

## Returns

`FormApi`\<`TParentData`, `TFormValidator`\> & [`SolidFormApi`](../interfaces/solidformapi.md)\<`TParentData`, `TFormValidator`\>

## Defined in

[packages/solid-form/src/createForm.tsx:34](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L34)
