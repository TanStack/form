---
id: VueFieldGroup
title: VueFieldGroup
---

# Type Alias: VueFieldGroup\<TFields, TFieldComponents\>

```ts
type VueFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:88](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L88)

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
