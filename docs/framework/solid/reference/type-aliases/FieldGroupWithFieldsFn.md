---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn\<TFieldGroup\>

```ts
type FieldGroupWithFieldsFn<TFieldGroup> = <TProps, TFieldsPropName>(Component, fieldsPropName) => <TFormData>(props) => JSX.Element;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:49](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L49)

## Type Parameters

### TFieldGroup

`TFieldGroup` *extends* [`SolidFieldGroup`](SolidFieldGroup.md)\<`any`, `any`\>

## Type Parameters

### TProps

`TProps` *extends* `object`

### TFieldsPropName

`TFieldsPropName` *extends* `FieldGroupFieldsPropName`\<`TProps`, `TFieldGroup`\>

## Parameters

### Component

(`props`) => `JSX.Element`

### fieldsPropName

`TFieldsPropName`

## Returns

\<`TFormData`\>(`props`) => `JSX.Element`
