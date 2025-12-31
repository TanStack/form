---
id: ArrayDeepKeyAndValue
title: ArrayDeepKeyAndValue
---

# Interface: ArrayDeepKeyAndValue\<TParent, T\>

Defined in: [packages/form-core/src/util-types.ts:33](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L33)

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

Defined in: [packages/form-core/src/util-types.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L37)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`key`](AnyDeepKeyAndValue.md#key)

***

### value

```ts
value: 
  | T[number]
| Nullable<TParent["value"]>;
```

Defined in: [packages/form-core/src/util-types.ts:38](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L38)

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`value`](AnyDeepKeyAndValue.md#value)
