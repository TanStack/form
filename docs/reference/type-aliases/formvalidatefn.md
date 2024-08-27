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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Parameters

• **props**

• **props.formApi**: [`FormApi`](../classes/formapi.md)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

## Returns

`FormValidationError`\<`TFormData`\>

## Defined in

[packages/form-core/src/FormApi.ts:28](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/form-core/src/FormApi.ts#L28)
