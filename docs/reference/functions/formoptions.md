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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

## Parameters

### defaultOpts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

## Returns

`undefined` \| [`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/form-core/src/formOptions.ts:5](https://github.com/TanStack/form/blob/main/packages/form-core/src/formOptions.ts#L5)
