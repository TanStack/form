---
id: DefineFieldGroupFn
title: DefineFieldGroupFn
---

# Type Alias: DefineFieldGroupFn\<TComponents\>

```ts
type DefineFieldGroupFn<TComponents> = <TFields>(defineFn) => FieldGroupDefinition<TFields, TComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:93](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L93)

Signature shared by `defineFieldGroup` and app-form field-group definers.

## Type Parameters

### TComponents

`TComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Parameters

### defineFn

(`helper`) => `TFields`

## Returns

[`FieldGroupDefinition`](../interfaces/FieldGroupDefinition.md)\<`TFields`, `TComponents`\>
