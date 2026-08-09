---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn()

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, Component, fieldsPropName) => <TFormData>(props) => CrossVersionPreactNode;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:162](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L162)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`FieldGroupDefinition`](FieldGroupDefinition.md)\<`any`, `any`\>

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* [`FieldGroupFieldsPropName`](FieldGroupFieldsPropName.md)\<`TProps`, `TFieldGroup`\>

## Parameters

### fields

`TFieldGroup`

### Component

(`props`) => [`CrossVersionPreactNode`](CrossVersionPreactNode.md)

### fieldsPropName

`TFieldsPropName`

## Returns

```ts
<TFormData>(props): CrossVersionPreactNode;
```

### Type Parameters

#### TFormData

`TFormData`

### Parameters

#### props

`Omit`\<`TProps`, `TFieldsPropName` \| `"form"`\> & `object` & `{ [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<TFieldGroup, TFormData> }`

### Returns

[`CrossVersionPreactNode`](CrossVersionPreactNode.md)
