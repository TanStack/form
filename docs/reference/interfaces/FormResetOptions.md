---
id: FormResetOptions
title: FormResetOptions
---

Defined in: [FormApi/FormApi.public.ts:150](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L150)

Controls whether [reset](FormApi.md#reset) replaces the form's default
values when new values are supplied.

## Properties

### updateDefaultValues?

```ts
optional updateDefaultValues?: boolean;
```

Defined in: [FormApi/FormApi.public.ts:161](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L161)

Whether the values supplied to `reset` also replace the form's `defaultValues`.

When `false`, the form preserves the existing defaults.
`isDefaultValue` and later `form.reset()` calls use those existing `defaultValues`.

This option has no effect when reset values are omitted.

#### Default

```ts
true
```
