---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

# Interface: FieldGroupDefinition\<TFields\>

Defined in: [with-fields.ts:164](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L164)

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](../type-aliases/FieldGroupFields.md)

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>;
```

Defined in: [with-fields.ts:168](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L168)

Binds a renderer's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: LitFieldGroup<TFields>;
```

Defined in: [with-fields.ts:166](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L166)

The virtual field-group API injected into the bound renderer.
