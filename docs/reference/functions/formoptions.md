---
id: formOptions
title: formOptions
---

# Function: formOptions()

```ts
function formOptions<TFormData, TFormValidator, TFormSubmitMeta>(defaultOpts?): 
  | undefined
| FormOptions<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/form-core/src/formOptions.ts:4](https://github.com/TanStack/form/blob/main/packages/form-core/src/formOptions.ts#L4)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** *extends* `object` = `never`

## Parameters

### defaultOpts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

## Returns

  \| `undefined`
  \| [`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>
