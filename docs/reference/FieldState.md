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

[packages/form-core/src/FieldApi.ts:361](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FieldApi.ts#L361)
