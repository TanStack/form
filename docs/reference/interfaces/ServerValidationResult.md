---
id: ServerValidationResult
title: ServerValidationResult
---

# Interface: ServerValidationResult\<TFormData, TResult\>

Defined in: [packages/form-core/src/ssr.public.ts:24](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L24)

## Type Parameters

### TFormData

`TFormData`

### TResult

`TResult` = [`FormValidateResult`](../type-aliases/FormValidateResult.md)\<`TFormData`\>

## Properties

### hasSchemaResult?

```ts
optional hasSchemaResult: boolean;
```

Defined in: [packages/form-core/src/ssr.public.ts:31](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L31)

***

### result

```ts
result: TResult;
```

Defined in: [packages/form-core/src/ssr.public.ts:29](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L29)

***

### schemaResult

```ts
schemaResult: unknown;
```

Defined in: [packages/form-core/src/ssr.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L30)

***

### validatorIndex

```ts
validatorIndex: number;
```

Defined in: [packages/form-core/src/ssr.public.ts:28](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L28)
