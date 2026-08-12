---
id: DefineFieldGroupFn
title: DefineFieldGroupFn
---

# Type Alias: DefineFieldGroupFn\<TFieldComponents\>

```ts
type DefineFieldGroupFn<TFieldComponents> = <TFields>(defineFn) => FieldGroupDefinition<TFields, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:180](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L180)

Signature shared by `defineFieldGroup` and app-form field-group definers.

## Type Parameters

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

## Parameters

### defineFn

(`helper`) => `TFields`

## Returns

[`FieldGroupDefinition`](../interfaces/FieldGroupDefinition.md)\<`TFields`, `TFieldComponents`\>
