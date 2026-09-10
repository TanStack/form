---
id: ReactComponentTree
title: ReactComponentTree
---

# Type Alias: ReactComponentTree

```ts
type ReactComponentTree = object;
```

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:20](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L20)

A recursively nested collection of components registered with
`createFormHook`.

Component trees are inferred from `fieldComponents` and `formComponents` in
normal usage. This type is primarily useful when building wrappers around
`createFormHook` or declaring reusable component registries.

## Index Signature

```ts
[name: string]: FunctionComponent<any> | ReactComponentTree
```

## Example

```tsx
const fields = {
  inputs: {
    TextField,
  },
} satisfies ReactComponentTree
```
