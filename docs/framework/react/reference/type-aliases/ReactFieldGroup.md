---
id: ReactFieldGroup
title: ReactFieldGroup
---

```ts
type ReactFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:25](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L25)

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
