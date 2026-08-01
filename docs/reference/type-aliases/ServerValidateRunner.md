---
id: ServerValidateRunner
title: ServerValidateRunner
---

# Type Alias: ServerValidateRunner()\<TFormData, TFormValidators\>

```ts
type ServerValidateRunner<TFormData, TFormValidators> = (values) => Promise<ServerValidateResult<TFormData, TFormValidators>>;
```

Defined in: [packages/form-core/src/ssr.public.ts:99](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/ssr.public.ts#L99)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`TFormData`\>

## Parameters

### values

`TFormData`

## Returns

`Promise`\<[`ServerValidateResult`](ServerValidateResult.md)\<`TFormData`, `TFormValidators`\>\>
