---
id: FieldState
title: FieldState
---

# Type Alias: FieldState\<TData\>

```ts
type FieldState<TData>: object;
```

An object type representing the state of a field.

## Type Parameters

• **TData**

## Type declaration

### meta

```ts
meta: FieldMeta;
```

The current metadata of the field.

### value

```ts
value: TData;
```

The current value of the field.

## Defined in

[packages/form-core/src/FieldApi.ts:363](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/form-core/src/FieldApi.ts#L363)
