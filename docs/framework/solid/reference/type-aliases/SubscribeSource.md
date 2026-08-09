---
id: SubscribeSource
title: SubscribeSource
---

# Type Alias: SubscribeSource\<TValue\>

```ts
type SubscribeSource<TValue> = 
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
| ReadonlyStore<TValue>;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:11](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Subscribe.public.ts#L11)

## Type Parameters

### TValue

`TValue`
