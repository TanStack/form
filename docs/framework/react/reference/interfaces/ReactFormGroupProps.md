---
id: ReactFormGroupProps
title: ReactFormGroupProps
---

# Interface: ReactFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:308](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L308)

## Extends

- `Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`\>, `"form"`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### children

```ts
children: (groupApi) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:325](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L325)

#### Parameters

##### groupApi

[`ReactFormGroupApi`](ReactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`ReactNode`
