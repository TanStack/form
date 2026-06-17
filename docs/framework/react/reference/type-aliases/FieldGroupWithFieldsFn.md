---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn()

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, Component, fieldsPropName) => <TFormData>(props) => CrossVersionReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:163](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L163)

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

(`props`) => [`CrossVersionReactNode`](CrossVersionReactNode.md)

### fieldsPropName

`TFieldsPropName`

## Returns

```ts
<TFormData>(props): CrossVersionReactNode;
```

### Type Parameters

#### TFormData

`TFormData`

### Parameters

#### props

`Omit`\<`TProps`, `TFieldsPropName` \| `"form"`\> & `object` & `{ [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<TFieldGroup, TFormData> }`

### Returns

[`CrossVersionReactNode`](CrossVersionReactNode.md)
