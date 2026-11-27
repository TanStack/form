---
id: AnyFormOptions
title: AnyFormOptions
---

```ts
type AnyFormOptions = Omit<FormOptions<any, any, any, any, any>, "onSubmit"> & object;
```

Defined in: [FormApi/formOptions.public.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formOptions.public.ts#L426)

Form options whose data, validator, and submission return types are erased.

Use this alias only when reusable code does not need type-safe access to
values, validators, or submission results.

## Type Declaration

### onSubmit?

```ts
optional onSubmit?: FormOptionsOnSubmitFn<any, any, any>;
```
