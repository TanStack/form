---
id: DefineFieldsFn
title: DefineFieldsFn
---

# Type Alias: DefineFieldsFn()\<TFieldComponents\>

```ts
type DefineFieldsFn<TFieldComponents> = <TFields>(fields) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:171](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L171)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

## Parameters

### fields

`TFields`

## Returns

[`FieldGroupDefinition`](FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
