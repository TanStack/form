---
id: DefineFieldsFn
title: DefineFieldsFn
---

# Type Alias: DefineFieldsFn\<TFieldComponents\>

```ts
type DefineFieldsFn<TFieldComponents> = <TFields>(fields) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:176](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L176)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

## Parameters

### fields

`TFields`

## Returns

[`FieldGroupDefinition`](FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
