---
id: ServerValidateSuccess
title: ServerValidateSuccess
---

Defined in: [ssr.public.ts:56](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L56)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

## Properties

### success

```ts
success: true;
```

Defined in: [ssr.public.ts:60](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L60)

***

### validatorOutputs

```ts
validatorOutputs: ToServerFormOutputs<TFormValidators>;
```

Defined in: [ssr.public.ts:67](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L67)

Schema outputs and `createOutput` payloads from this server validation,
ordered by validator index. Validators without a server trigger or output
contribute `undefined`. These are separate from client submission outputs.

***

### values

```ts
values: TFormData;
```

Defined in: [ssr.public.ts:61](https://github.com/TanStack/form/blob/main/packages/form-core/src/ssr.public.ts#L61)
