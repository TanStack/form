---
id: injectForm
title: injectForm
---

# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

## Parameters

### opts?

`FormOptions`\<`TFormData`, `TFormValidator`\>

## Returns

`FormApi`\<`TFormData`, `TFormValidator`\>

## Defined in

[inject-form.ts:9](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-form.ts#L9)
