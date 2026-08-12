---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TComponents\>

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:160](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L160)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

### TComponents

`TComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<SvelteFieldGroup<TFields, TComponents>>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:167](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L167)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: SvelteFieldGroup<TFields, TComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:165](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L165)

The virtual field-group API injected into the bound component.
