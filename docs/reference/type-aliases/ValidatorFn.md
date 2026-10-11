---
id: ValidatorFn
title: ValidatorFn
---

```ts
type ValidatorFn<TParameter, TReturn> = (...args) => TReturn | Promise<TReturn>;
```

Defined in: [validation.public.ts:787](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L787)

A validation callback that can return a result immediately or asynchronously.

## Type Parameters

### TParameter

`TParameter`

Library-managed. Do not specify explicitly.

### TReturn

`TReturn`

Library-managed. Do not specify explicitly.

## Parameters

### args

...`TParameter`[]

## Returns

`TReturn` \| `Promise`\<`TReturn`\>
