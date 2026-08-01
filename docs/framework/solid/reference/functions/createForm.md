---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TData, TFormValidators, TSubmitReturn>(options): SolidFormApi<TData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [packages/solid-form/src/createForm.public.ts:143](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L143)

TODO docs

## Type Parameters

### TData

`TData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`Accessor`\<`FormOptions`\<`TData`, `TFormValidators`, `TSubmitReturn`\>\>

## Returns

[`SolidFormApi`](../interfaces/SolidFormApi.md)\<`TData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>
