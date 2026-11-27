---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:72](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L72)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<SolidFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:79](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L79)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: SolidFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:77](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L77)

The virtual field-group API injected into the bound component.
