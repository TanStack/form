---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T\>

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: [deep-keys.public.ts:208](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/deep-keys.public.ts#L208)

The keys of an object or array, deeply nested.

## Type Parameters

### T

`T`
