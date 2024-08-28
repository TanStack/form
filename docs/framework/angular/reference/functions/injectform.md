---
id: injectForm
title: injectForm
---

# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **opts?**: `FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\>

## Defined in

[inject-form.ts:4](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/angular-form/src/inject-form.ts#L4)
