---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields\>

Defined in: [with-fields.ts:82](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L82)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>;
```

Defined in: [with-fields.ts:86](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L86)

Binds a renderer's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: LitFieldGroup<TFields>;
```

Defined in: [with-fields.ts:84](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L84)

The virtual field-group API injected into the bound renderer.
