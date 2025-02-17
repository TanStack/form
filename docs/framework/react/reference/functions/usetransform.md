---
id: useTransform
title: useTransform
---

# Function: useTransform()

```ts
function useTransform<TFormData, TFormValidator, TFormSubmitMeta>(fn, deps): FormTransform<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/react-form/src/useTransform.ts:3](https://github.com/TanStack/form/blob/main/packages/react-form/src/useTransform.ts#L3)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** = `never`

## Parameters

### fn

(`formBase`) => `FormApi`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

### deps

`unknown`[]

## Returns

`FormTransform`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>
