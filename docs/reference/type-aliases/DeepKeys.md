---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T\>

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: [packages/form-core/src/util-types.ts:160](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L160)

The keys of an object or array, deeply nested.

## Type Parameters

### T

`T`
