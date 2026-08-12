---
id: PreactFieldGroup
title: PreactFieldGroup
---

# Type Alias: PreactFieldGroup\<TFields, TFieldComponents\>

```ts
type PreactFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:97](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L97)

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
