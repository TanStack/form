---
id: BaseFormOptions
title: BaseFormOptions
---

Defined in: [packages/form-core/src/FormApi.ts:434](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L434)

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

Defined in: [packages/form-core/src/FormApi.ts:438](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L438)

Set initial values for your form.

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TSubmitMeta;
```

Defined in: [packages/form-core/src/FormApi.ts:442](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L442)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props
