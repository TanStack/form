---
id: AnyFormApi
title: AnyFormApi
---

```ts
type AnyFormApi = FormApi<any, any>;
```

Defined in: [FormApi/FormApi.public.ts:144](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L144)

A form API whose form data and error types are erased.

Use it for reusable helpers that read shared form state, such as `isDirty`
or `isSubmitting`, without depending on a specific form shape.

## Remarks

**Important:** Field paths and values are not checked against a particular
form shape.
