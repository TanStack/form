---
id: injectForm
title: injectForm
---

# Function: injectForm()

```ts
function injectForm<TFormData, TFormValidators, TSubmitReturn>(options): InternalFormApi<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [angular-form/src/inject-form.ts:9](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-form.ts#L9)

Creates and mounts a v2 form in the current Angular injection context.

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

`InternalFormApi`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>
