---
id: WithoutFunction
title: WithoutFunction
---

```ts
type WithoutFunction<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };
```

Defined in: [packages/svelte-form/src/Components.public.ts:25](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L25)

## Type Parameters

### T

`T`
