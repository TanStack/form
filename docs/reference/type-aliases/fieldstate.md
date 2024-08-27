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

[packages/form-core/src/FieldApi.ts:363](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/form-core/src/FieldApi.ts#L363)
