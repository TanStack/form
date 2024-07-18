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

[packages/form-core/src/FieldApi.ts:361](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FieldApi.ts#L361)
