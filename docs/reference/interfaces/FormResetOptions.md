---
id: FormResetOptions
title: FormResetOptions
---

# Interface: FormResetOptions

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:167](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L167)

## Properties

### updateDefaultValues?

```ts
optional updateDefaultValues: boolean;
```

Defined in: [packages/form-core/src/FormApi/FormApi.public.ts:186](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L186)

Whether `reset(values)` should also update the form's `defaultValues`
baseline.

By default, passing values to `reset` treats those values as the new reset
baseline. Future `reset()` calls will return to those values, and
`state.isDefaultValue` will compare against them.

Set this to `false` when you want reset semantics for form state
(clearing touched, dirty, validation, submission state, and mounted fields)
but want to keep comparing against the previous `defaultValues`.

With `updateDefaultValues: false`, `state.isDirty` is reset to `false`,
but `state.isDefaultValue` may be `false` if the provided reset values do
not deeply equal the preserved defaults.

This option is ignored when no reset values are provided.
