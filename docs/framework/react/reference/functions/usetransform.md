---
id: useTransform
title: useTransform
---

# Function: useTransform()

```ts
function useTransform<TFormData, TFormValidator>(fn, deps): FormTransform<TFormData, TFormValidator>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

## Parameters

• **fn**

• **deps**: `unknown`[]

## Returns

`FormTransform`\<`TFormData`, `TFormValidator`\>

## Defined in

[useTransform.ts:3](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/react-form/src/useTransform.ts#L3)
