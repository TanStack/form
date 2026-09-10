---
id: ReactFormGroupComponent
title: ReactFormGroupComponent
---

# Interface: ReactFormGroupComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:337](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L337)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

```ts
ReactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:342](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L342)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

## Parameters

### props

[`ReactFormGroupProps`](ReactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ReactNode`
