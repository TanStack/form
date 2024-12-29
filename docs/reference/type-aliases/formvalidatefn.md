---
id: FormValidateFn
title: FormValidateFn
---

# Type Alias: FormValidateFn()\<TFormData, TFormValidator\>

```ts
type FormValidateFn<TFormData, TFormValidator>: (props) => ValidationResult | FormValidationResult<TFormData>;
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Parameters

### props

#### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

#### value

`TFormData`

## Returns

[`ValidationResult`](validationresult.md) \| `FormValidationResult`\<`TFormData`\>

## Defined in

[packages/form-core/src/FormApi.ts:38](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L38)
