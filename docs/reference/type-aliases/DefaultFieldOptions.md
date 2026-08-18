---
id: DefaultFieldOptions
title: DefaultFieldOptions
---

# Type Alias: DefaultFieldOptions

```ts
type DefaultFieldOptions = Pick<FieldApiOptions<unknown, string, unknown, FieldValidators<unknown, string, unknown>, never, unknown, FormErrorTypes>, "errorVisibility" | "errorBoundary" | "listeners"> & DefaultListenersMergeOptions;
```

Defined in: [defaultOptions.public.ts:82](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L82)

Reusable field behavior that does not participate in form or field value
inference.

Only `errorVisibility`, `errorBoundary`, `listeners`, and `listenersMerge`
can be shared this way. Listener values and APIs are typed with `unknown`
values, so value-dependent behavior should remain in the usage-site field
options. Usage-site properties override defaults even when explicitly set
to `undefined`; a supplied listener array instead follows `listenersMerge`.

## Example

```ts
const fieldDefaults: DefaultFieldOptions = {
  errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
  errorBoundary: true,
}
```
