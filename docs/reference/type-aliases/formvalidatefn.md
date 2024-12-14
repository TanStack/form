---
id: FormValidateFn
title: FormValidateFn
---

# Type Alias: FormValidateFn()\<TFormData, TFormValidator\>

```ts
type FormValidateFn<TFormData, TFormValidator>: (props) => FormValidationError<TFormData>;
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = [`StandardSchemaValidator`](standardschemavalidator.md)

## Parameters

### props

#### formApi

[`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

#### value

`TFormData`

## Returns

`FormValidationError`\<`TFormData`\>

## Defined in

[packages/form-core/src/FormApi.ts:36](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L36)
