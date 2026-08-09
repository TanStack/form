---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Type Alias: FieldGroupDefinition\<TFields, TFieldComponents\>

```ts
type FieldGroupDefinition<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:92](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L92)

## Type Declaration

### \[fieldGroupFieldsSymbol\]

```ts
readonly [fieldGroupFieldsSymbol]: TFields;
```

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\> = `Record`\<`never`, `never`\>
