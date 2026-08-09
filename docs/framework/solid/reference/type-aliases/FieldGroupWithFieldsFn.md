---
id: FieldGroupWithFieldsFn
title: FieldGroupWithFieldsFn
---

# Type Alias: FieldGroupWithFieldsFn()

```ts
type FieldGroupWithFieldsFn = <TFieldGroup, TProps, TFieldsPropName>(fields, Component, fieldsPropName) => <TFormData>(props) => JSX.Element;
```

Defined in: [packages/solid-form/src/FieldGroup/withFields.public.ts:147](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/withFields.public.ts#L147)

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

(`props`) => `JSX.Element`

### fieldsPropName

`TFieldsPropName`

## Returns

```ts
<TFormData>(props): JSX.Element;
```

### Type Parameters

#### TFormData

`TFormData`

### Parameters

#### props

`Omit`\<`TProps`, `TFieldsPropName` \| `"form"`\> & `object` & `{ [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<TFieldGroup, TFormData> }`

### Returns

`JSX.Element`
