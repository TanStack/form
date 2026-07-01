---
id: TryGetArrayElementType
title: TryGetArrayElementType
---

# Type Alias: TryGetArrayElementType\<TValue\>

```ts
type TryGetArrayElementType<TValue> = TValue extends ReadonlyArray<infer TElement> ? TElement : never;
```

Defined in: [packages/form-core/src/deep-keys.public.ts:233](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/deep-keys.public.ts#L233)

## Type Parameters

### TValue

`TValue`
