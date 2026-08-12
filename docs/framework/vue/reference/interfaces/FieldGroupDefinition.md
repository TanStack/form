---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:170](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L170)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<VueFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:177](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L177)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: VueFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:175](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L175)

The virtual field-group API injected into the bound component.
