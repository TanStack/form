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

Defined in: [packages/vue-form/src/Subscribe.public.ts:11](https://github.com/TanStack/form/blob/main/packages/vue-form/src/Subscribe.public.ts#L11)

## Type Parameters

### TValue

`TValue`
