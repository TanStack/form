---
id: Awaitable
title: Awaitable
---

```ts
type Awaitable<TReturn> = TReturn | Promise<TReturn>;
```

Defined in: [types.public.ts:39](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.public.ts#L39)

A value that may or may not be a promise. Compatible with `await`.

## Type Parameters

### TReturn

`TReturn`
