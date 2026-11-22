---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [with-fields.ts:104](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L104)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<LitFieldGroup<TFields>>;
```

Defined in: [with-fields.ts:108](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L108)

Binds a renderer's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: LitFieldGroup<TFields>;
```

Defined in: [with-fields.ts:106](https://github.com/TanStack/form/blob/main/packages/lit-form/src/with-fields.ts#L106)

The virtual field-group API injected into the bound renderer.
