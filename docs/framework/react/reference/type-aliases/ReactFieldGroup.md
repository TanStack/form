---
id: ReactFieldGroup
title: ReactFieldGroup
---

# Type Alias: ReactFieldGroup\<TFields, TFieldComponents\>

```ts
type ReactFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:96](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L96)

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
