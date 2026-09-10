---
id: ObjectDeepKeyAndValue
title: ObjectDeepKeyAndValue
---

# Interface: ObjectDeepKeyAndValue\<TParent, T, TKey\>

Defined in: [packages/form-core/src/util-types.ts:114](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L114)

## Extends

- [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

### T

`T`

### TKey

`TKey` *extends* [`AllObjectKeys`](../type-aliases/AllObjectKeys.md)\<`T`\>

## Properties

### key

```ts
key: ObjectAccessor<TParent, TKey>;
```

Defined in: [packages/form-core/src/util-types.ts:119](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L119)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`key`](AnyDeepKeyAndValue.md#key)

***

### value

```ts
value: ObjectValue<TParent, T, TKey>;
```

Defined in: [packages/form-core/src/util-types.ts:120](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L120)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`value`](AnyDeepKeyAndValue.md#value)
