---
id: ServerFormState
title: ServerFormState
---

# Interface: ServerFormState\<TFormData, TFormValidators\>

Defined in: [packages/form-core/src/ssr.public.ts:22](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L22)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

## Properties

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/ssr.public.ts:28](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L28)

***

### validationResults

```ts
validationResults: ServerValidationResult<TFormData>[];
```

Defined in: [packages/form-core/src/ssr.public.ts:27](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L27)

***

### values

```ts
values: TFormData | undefined;
```

Defined in: [packages/form-core/src/ssr.public.ts:26](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L26)
