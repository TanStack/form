---
id: DefineFieldGroupFn
title: DefineFieldGroupFn
---

# Type Alias: DefineFieldGroupFn\<TFieldComponents\>

```ts
type DefineFieldGroupFn<TFieldComponents> = <TFields>(defineFn) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:199](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L199)

Signature shared by `defineFieldGroup` and app-form field-group definers.

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Parameters

### defineFn

(`helper`) => `TFields`

## Returns

[`FieldGroupDefinition`](../interfaces/FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
