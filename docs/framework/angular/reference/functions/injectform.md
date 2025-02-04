---
id: injectForm
title: injectForm
---

# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidator, TFormSubmitMeta>(opts?): FormApi<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [inject-form.ts:5](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-form.ts#L5)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TFormSubmitMeta** = `never`

## Parameters

### opts?

`FormOptions`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>
