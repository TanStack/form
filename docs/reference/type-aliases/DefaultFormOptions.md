---
id: DefaultFormOptions
title: DefaultFormOptions
---

# Type Alias: DefaultFormOptions

```ts
type DefaultFormOptions = Pick<FormOptions<unknown, FormValidators<unknown>, unknown, unknown>, "errorVisibility" | "listeners" | "onSubmitInvalid"> & DefaultListenersMergeOptions;
```

Defined in: [defaultOptions.public.ts:58](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L58)

Reusable form behavior that does not participate in form value inference.

Only `errorVisibility`, `listeners`, `onSubmitInvalid`, and `listenersMerge`
can be shared this way. Callback values are typed as `unknown`, so behavior
that depends on the inferred form value should remain in the usage-site form
options. Usage-site properties override defaults even when explicitly set
to `undefined`; a supplied listener array instead follows `listenersMerge`.

## Example

```ts
const formDefaults: DefaultFormOptions = {
  errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
  listenersMerge: 'append',
  onSubmitInvalid: () => {
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  },
}
```
