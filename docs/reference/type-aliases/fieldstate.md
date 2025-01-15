---
id: FieldState
title: FieldState
---

# Type Alias: FieldState\<TData\>

```ts
type FieldState<TData> = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:407](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L407)

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
