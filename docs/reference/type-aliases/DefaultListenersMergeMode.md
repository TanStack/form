---
id: DefaultListenersMergeMode
title: DefaultListenersMergeMode
---

# Type Alias: DefaultListenersMergeMode

```ts
type DefaultListenersMergeMode = "replace" | "append" | "prepend";
```

Defined in: [defaultOptions.public.ts:20](https://github.com/TanStack/form/blob/main/packages/form-core/src/defaultOptions.public.ts#L20)

Determines how a supplied usage-site listener array combines with default
listeners.

`'append'` runs default listeners before usage-site listeners. `'prepend'`
runs usage-site listeners first. `'replace'` uses only the usage-site
listeners. Omitting the usage-site property keeps the defaults, while
explicitly setting it to `undefined` suppresses them.
