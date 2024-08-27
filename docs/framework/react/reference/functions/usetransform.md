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

[useTransform.ts:3](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/react-form/src/useTransform.ts#L3)
