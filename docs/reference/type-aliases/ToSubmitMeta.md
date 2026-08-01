---
id: ToSubmitMeta
title: ToSubmitMeta
---

# Type Alias: ToSubmitMeta\<TSubmitReturn\>

```ts
type ToSubmitMeta<TSubmitReturn> = unknown extends TSubmitReturn ? SubmitMeta<any, any> : SubmitMeta<ParseSubmitFormError<TSubmitReturn>, ParseSubmitFieldError<TSubmitReturn>>;
```

Defined in: [packages/form-core/src/validation.public.ts:614](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L614)

## Type Parameters

### TSubmitReturn

`TSubmitReturn`
