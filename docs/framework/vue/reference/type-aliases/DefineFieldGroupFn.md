---
id: DefineFieldGroupFn
title: DefineFieldGroupFn
---

# Type Alias: DefineFieldGroupFn\<TFieldComponents\>

```ts
type DefineFieldGroupFn<TFieldComponents> = <TFields>(defineFn) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:183](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L183)

Signature shared by `defineFieldGroup` and app-form field-group definers.

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

## Parameters

### defineFn

(`helper`) => `TFields`

## Returns

[`FieldGroupDefinition`](../interfaces/FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
