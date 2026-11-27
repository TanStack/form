---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:87](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L87)

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

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:94](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L94)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: SvelteFieldGroup<TFields, TComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:92](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L92)

The virtual field-group API injected into the bound component.
