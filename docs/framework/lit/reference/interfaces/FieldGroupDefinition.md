---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [with-fields.ts:105](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L105)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>;
```

Defined in: [with-fields.ts:109](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L109)

Binds a renderer's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: LitFieldGroup<TFields>;
```

Defined in: [with-fields.ts:107](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L107)

The virtual field-group API injected into the bound renderer.
