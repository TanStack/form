---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, Component, fieldsPropName) => <TFormData>(props) => ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/withFields.public.ts:161](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts#L161)

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

(`props`) => `ReactNode`

### fieldsPropName

`TFieldsPropName`

## Returns

\<`TFormData`\>(`props`) => `ReactNode`
