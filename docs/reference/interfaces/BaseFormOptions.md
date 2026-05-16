---
id: BaseFormOptions
title: BaseFormOptions
---

# Interface: BaseFormOptions\<TFormData, TSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L337)

An object representing the base properties of a form, unrelated to any validators

## Extended by

- [`FormOptions`](FormOptions.md)

## Type Parameters

### TFormData

`TFormData`

### TSubmitMeta

`TSubmitMeta` = `never`

## Properties

### defaultValues?

```ts
optional defaultValues: TFormData;
```

Defined in: [packages/form-core/src/FormApi.ts:341](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L341)

Set initial values for your form.

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TSubmitMeta;
```

Defined in: [packages/form-core/src/FormApi.ts:345](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L345)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
