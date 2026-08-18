---
id: DefaultFormGroupOptions
title: DefaultFormGroupOptions
---

# Type Alias: DefaultFormGroupOptions

```ts
type DefaultFormGroupOptions = Pick<FormGroupOptions<unknown, string, unknown, FormGroupValidators<unknown>, FormErrorTypes>, "onSubmitInvalid">;
```

Defined in: [defaultOptions.public.ts:114](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L114)

Reusable form-group behavior that does not participate in group value
inference.

Only `onSubmitInvalid` can be shared this way. Its callback receives
`unknown` form and group values, so value-dependent behavior should remain
in the usage-site form-group options. A usage-site `onSubmitInvalid`
property overrides the default even when explicitly set to `undefined`.

## Example

```ts
const formGroupDefaults: DefaultFormGroupOptions = {
  onSubmitInvalid: ({ groupApi }) => {
    console.error('Invalid group', groupApi.name)
  },
}
```
