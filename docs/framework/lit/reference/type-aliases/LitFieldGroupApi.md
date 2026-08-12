---
id: LitFieldGroupApi
title: LitFieldGroupApi
---

# Type Alias: LitFieldGroupApi\<TFieldData\>

```ts
type LitFieldGroupApi<TFieldData> = LitFieldMethods<TFieldData, ValidationIssue, unknown, FormErrorTypes> & LitSubscribeMethod<TFieldData> & FormApiFieldMethods<TFieldData> & FormApiArrayMethods<TFieldData> & object;
```

Defined in: [with-fields.ts:78](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L78)

## Type Declaration

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

## Type Parameters

### TFieldData

`TFieldData`
