---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields, TFieldComponents\>

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:182](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L182)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<PreactFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:189](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L189)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: PreactFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:187](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L187)

The virtual field-group API injected into the bound component.
