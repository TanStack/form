---
id: ServerValidateFrameworkCreateServerValidate
title: ServerValidateFrameworkCreateServerValidate
---

# Type Alias: ServerValidateFrameworkCreateServerValidate()

```ts
type ServerValidateFrameworkCreateServerValidate = <TFormData, TFormValidators, TSubmitReturn>(formOptions, pluginOptions?) => unknown;
```

Defined in: [packages/form-core/src/ssr.public.ts:106](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L106)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### formOptions

[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

### pluginOptions?

`any`

## Returns

`unknown`
