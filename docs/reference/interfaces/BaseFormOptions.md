---
id: BaseFormOptions
title: BaseFormOptions
---

# Interface: BaseFormOptions\<TFormData, TSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:332](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L332)

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

Defined in: [packages/form-core/src/FormApi.ts:336](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L336)

Set initial values for your form.

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TSubmitMeta;
```

Defined in: [packages/form-core/src/FormApi.ts:340](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L340)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
