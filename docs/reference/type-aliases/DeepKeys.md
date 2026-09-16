---
id: DeepKeys
title: DeepKeys
---

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: [deep-keys.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L208)

The keys of an object or array, deeply nested.

## Type Parameters

### T

`T`
