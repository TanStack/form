---
id: ReactFieldGroup
title: ReactFieldGroup
---

# Type Alias: ReactFieldGroup\<TFields, TFieldComponents\>

```ts
type ReactFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:24](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L24)

## Type Declaration

### \[fieldGroupFieldsSymbol\]

```ts
readonly [fieldGroupFieldsSymbol]: TFields;
```

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md) = `Record`\<`never`, `never`\>
