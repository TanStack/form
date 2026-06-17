---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Type Alias: FieldGroupDefinition\<TFields, TFieldComponents\>

```ts
type FieldGroupDefinition<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:102](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L102)

## Type Declaration

### \[fieldGroupFieldsSymbol\]

```ts
readonly [fieldGroupFieldsSymbol]: TFields;
```

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\> = `Record`\<`never`, `never`\>
