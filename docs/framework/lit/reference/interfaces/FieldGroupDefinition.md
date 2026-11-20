---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [with-fields.ts:88](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L88)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>;
```

Defined in: [with-fields.ts:92](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L92)

Binds a renderer's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: LitFieldGroup<TFields>;
```

Defined in: [with-fields.ts:90](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L90)

The virtual field-group API injected into the bound renderer.
