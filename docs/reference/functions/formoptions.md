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

[packages/form-core/src/formOptions.ts:4](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/form-core/src/formOptions.ts#L4)
