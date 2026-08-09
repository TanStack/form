---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, Component, fieldsPropName) => <TFormData>(props) => CrossVersionReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:162](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L162)

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

\<`TFormData`\>(`props`) => [`CrossVersionReactNode`](CrossVersionReactNode.md)
