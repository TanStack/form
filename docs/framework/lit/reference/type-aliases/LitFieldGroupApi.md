---
id: LitFieldGroupApi
title: LitFieldGroupApi
---

```ts
type LitFieldGroupApi<TFieldData> = LitFieldMethods<TFieldData, ScopedErrorTypes, unknown, ScopedErrorTypes> & LitSubscribeMethod<TFieldData> & FormApiFieldMethods<TFieldData> & FormApiArrayMethods<TFieldData> & object;
```

Defined in: [with-fields.ts:34](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L34)

## Type Declaration

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

## Type Parameters

### TFieldData

`TFieldData`
