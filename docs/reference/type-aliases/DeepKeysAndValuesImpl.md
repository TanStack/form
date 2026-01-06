---
id: DeepKeysAndValuesImpl
title: DeepKeysAndValuesImpl
---

# Type Alias: DeepKeysAndValuesImpl\<T, TParent, TAcc\>

```ts
type DeepKeysAndValuesImpl<T, TParent, TAcc> = unknown extends T ? 
  | TAcc
  | UnknownDeepKeyAndValue<TParent> : unknown extends T ? T : T extends string | number | boolean | bigint | Date ? TAcc : T extends ReadonlyArray<any> ? number extends T["length"] ? DeepKeyAndValueArray<TParent, T, TAcc> : DeepKeyAndValueTuple<TParent, T, TAcc> : keyof T extends never ? 
  | TAcc
  | UnknownDeepKeyAndValue<TParent> : T extends object ? DeepKeyAndValueObject<TParent, T, TAcc> : TAcc;
```

Defined in: [packages/form-core/src/util-types.ts:134](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L134)

## Type Parameters

### T

`T`

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](../interfaces/AnyDeepKeyAndValue.md) = `never`

### TAcc

`TAcc` = `never`
