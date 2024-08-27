---
id: formOptions
title: formOptions
---

# Function: formOptions()

```ts
function formOptions<TFormData, TFormValidator>(defaultOpts?): undefined | FormOptions<TFormData, TFormValidator>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **defaultOpts?**: [`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

## Returns

`undefined` \| [`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/form-core/src/formOptions.ts:4](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/form-core/src/formOptions.ts#L4)
