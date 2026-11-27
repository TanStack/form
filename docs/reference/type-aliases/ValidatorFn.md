---
id: ValidatorFn
title: ValidatorFn
---

```ts
type ValidatorFn<TParameter, TReturn> = (...args) => TReturn | Promise<TReturn>;
```

Defined in: [pipeline/validation/validation.public.ts:507](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L507)

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
