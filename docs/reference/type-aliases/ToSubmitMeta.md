---
id: ToSubmitMeta
title: ToSubmitMeta
---

# Type Alias: ToSubmitMeta\<TSubmitReturn\>

```ts
type ToSubmitMeta<TSubmitReturn> = unknown extends TSubmitReturn ? SubmitMeta<any, any> : SubmitMeta<ParseSubmitFormError<TSubmitReturn>, ParseSubmitFieldError<TSubmitReturn>>;
```

Defined in: [validation.public.ts:468](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L468)

## Type Parameters

### TSubmitReturn

`TSubmitReturn`
