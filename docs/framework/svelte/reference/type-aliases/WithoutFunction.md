---
id: WithoutFunction
title: WithoutFunction
---

# Type Alias: WithoutFunction\<T\>

```ts
type WithoutFunction<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };
```

Defined in: [packages/svelte-form/src/Components.public.ts:24](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L24)

## Type Parameters

### T

`T`
