---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:167](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L167)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<SolidFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:174](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L174)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: SolidFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:172](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L172)

The virtual field-group API injected into the bound component.
