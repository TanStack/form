---
id: DefineFieldsFn
title: DefineFieldsFn
---

# Type Alias: DefineFieldsFn()\<TFieldComponents\>

```ts
type DefineFieldsFn<TFieldComponents> = <TFields>(fields) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:188](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L188)

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

## Parameters

### fields

`TFields`

## Returns

[`FieldGroupDefinition`](FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
