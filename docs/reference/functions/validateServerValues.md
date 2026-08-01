---
id: validateServerValues
title: validateServerValues
---

# Function: validateServerValues()

```ts
function validateServerValues<TFormData, TFormValidators, TSubmitReturn>(options, values): Promise<ServerValidateResult<TFormData, TFormValidators>>;
```

Defined in: [packages/form-core/src/ssr.lib.ts:130](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.lib.ts#L130)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

### values

`TFormData`

## Returns

`Promise`\<[`ServerValidateResult`](../type-aliases/ServerValidateResult.md)\<`TFormData`, `TFormValidators`\>\>
