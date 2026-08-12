---
id: AnyFormApi
title: AnyFormApi
---

# Type Alias: AnyFormApi

```ts
type AnyFormApi = FormApi<any, any>;
```

Defined in: [FormApi/FormApi.public.ts:287](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L287)

A core form API whose value and error types are erased.

Use it for reusable helpers that only need operations shared by every form.
Field paths and values are not type-checked through this alias, and it does
not include component helpers added by a framework adapter.
