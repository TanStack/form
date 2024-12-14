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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

## Parameters

### fn

(`formBase`) => `FormApi`\<`TFormData`, `TFormValidator`\>

### deps

`unknown`[]

## Returns

`FormTransform`\<`TFormData`, `TFormValidator`\>

## Defined in

[packages/react-form/src/useTransform.ts:8](https://github.com/TanStack/form/blob/main/packages/react-form/src/useTransform.ts#L8)
