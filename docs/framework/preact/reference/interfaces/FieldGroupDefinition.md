---
id: FieldGroupDefinition
title: FieldGroupDefinition
---

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:76](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L76)

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### bindComponent

```ts
bindComponent: FieldGroupWithFieldsFn<PreactFieldGroup<TFields, TFieldComponents>>;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:83](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L83)

Binds a component's virtual field API to concrete paths in a form.

***

### fields

```ts
fields: PreactFieldGroup<TFields, TFieldComponents>;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:81](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L81)

The virtual field-group API injected into the bound component.
