---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T\>

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: [deep-keys.public.ts:211](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/deep-keys.public.ts#L211)

The keys of an object or array, deeply nested.

## Type Parameters

### T

`T`
