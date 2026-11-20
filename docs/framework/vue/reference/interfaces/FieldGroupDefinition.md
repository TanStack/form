---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:102](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L102)

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

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:109](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L109)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: VueFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/withFields.public.ts:107](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/withFields.public.ts#L107)

The virtual field-group API injected into the bound component.
