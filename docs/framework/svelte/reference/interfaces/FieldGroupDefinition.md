---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TComponents\>

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:82](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L82)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TComponents

`TComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<SvelteFieldGroup<TFields, TComponents>>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:89](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L89)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: SvelteFieldGroup<TFields, TComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:87](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L87)

The virtual field-group API injected into the bound component.
