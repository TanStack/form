---
id: toObserver
title: toObserver
---

# Function: toObserver()

```ts
function toObserver<T>(
   nextHandler?, 
   errorHandler?, 
completionHandler?): Observer<T>;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/atom.d.ts:4

## Type Parameters

### T

`T`

## Parameters

### nextHandler?

[`Observer`](../type-aliases/Observer.md)\<`T`\> \| ((`value`) => `void`)

### errorHandler?

(`error`) => `void`

### completionHandler?

() => `void`

## Returns

[`Observer`](../type-aliases/Observer.md)\<`T`\>
