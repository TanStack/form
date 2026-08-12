---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(Component, fieldsPropName) => <TFormData>(props) => CrossVersionPreactNode;
```

Defined in: [packages/preact-form/src/FieldGroup/withFields.public.ts:158](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/withFields.public.ts#L158)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`PreactFieldGroup`](PreactFieldGroup.md)\<`any`, `any`\>

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* [`FieldGroupFieldsPropName`](FieldGroupFieldsPropName.md)\<`TProps`, `TFieldGroup`\>

## Parameters

### Component

(`props`) => [`CrossVersionPreactNode`](CrossVersionPreactNode.md)

### fieldsPropName

`TFieldsPropName`

## Returns

\<`TFormData`\>(`props`) => [`CrossVersionPreactNode`](CrossVersionPreactNode.md)
