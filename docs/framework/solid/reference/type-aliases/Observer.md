---
id: Observer
title: Observer
---

# Type Alias: Observer\<T\>

```ts
type Observer<T> = object;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:8

## Type Parameters

### T

`T`

## Properties

### complete?

```ts
optional complete?: () => void;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:11

#### Returns

`void`

***

### error?

```ts
optional error?: (err) => void;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:10

#### Parameters

##### err

`unknown`

#### Returns

`void`

***

### next?

```ts
optional next?: (value) => void;
```

Defined in: node\_modules/.pnpm/@tanstack+store@0.11.1/node\_modules/@tanstack/store/dist/types.d.ts:9

#### Parameters

##### value

`T`

#### Returns

`void`
