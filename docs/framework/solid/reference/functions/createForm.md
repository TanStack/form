---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TData, TFormValidators, TSubmitReturn>(options): SolidFormApi<TData, ToFormValidatorMetas<TFormValidators>, ToSubmitMeta<TSubmitReturn>>;
```

Defined in: [packages/solid-form/src/createForm.public.ts:172](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L172)

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

[`SolidFormApi`](../interfaces/SolidFormApi.md)\<`TData`, `ToFormValidatorMetas`\<`TFormValidators`\>, `ToSubmitMeta`\<`TSubmitReturn`\>\>
