# Type alias: FieldState\<TData\>

```ts
type FieldState<TData>: object;
```

An object type representing the state of a field.

## Type parameters

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

## Source

[packages/form-core/src/FieldApi.ts:365](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/form-core/src/FieldApi.ts#L365)
