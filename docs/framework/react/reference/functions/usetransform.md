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

### fn

(`formBase`) => `FormApi`\<`TFormData`, `TFormValidator`\>

### deps

`unknown`[]

## Returns

`FormTransform`\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/react-form/src/useTransform.ts:3](https://github.com/TanStack/form/blob/main/packages/react-form/src/useTransform.ts#L3)
