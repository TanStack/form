---
id: TryGetArrayElementType
title: TryGetArrayElementType
---

# Type Alias: TryGetArrayElementType\<TValue\>

```ts
type TryGetArrayElementType<TValue> = TValue extends ReadonlyArray<infer TElement> ? TElement : never;
```

Defined in: [deep-keys.public.ts:230](https://github.com/TanStack/form/blob/main/packages/form-core/src/deep-keys.public.ts#L230)

## Type Parameters

### TValue

`TValue`
