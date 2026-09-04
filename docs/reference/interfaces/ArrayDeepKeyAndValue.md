---
id: ArrayDeepKeyAndValue
title: ArrayDeepKeyAndValue
---

# Interface: ArrayDeepKeyAndValue\<TParent, T\>

Defined in: [packages/form-core/src/util-types.ts:50](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L50)

## Extends

- [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

### T

`T` *extends* `ReadonlyArray`\<`any`\>

## Properties

### key

```ts
key: `${TParent["key"] extends never ? "" : TParent["key"]}[${number}]`;
```

Defined in: [packages/form-core/src/util-types.ts:54](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L54)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`key`](AnyDeepKeyAndValue.md#key)

***

### value

```ts
value: 
  | T[number]
| Nullable<TParent["value"]>;
```

Defined in: [packages/form-core/src/util-types.ts:55](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L55)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`value`](AnyDeepKeyAndValue.md#value)
