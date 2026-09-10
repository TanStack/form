---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:95](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L95)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<VueFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:102](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L102)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: VueFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:100](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L100)

The virtual field-group API injected into the bound component.
