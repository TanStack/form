---
id: ReactFormGroupComponent
title: ReactFormGroupComponent
---

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:332](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L332)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

```ts
ReactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators, TSubmitReturn>(props): ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:337](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L337)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TSubmitReturn

`TSubmitReturn` = `void`

## Parameters

### props

[`ReactFormGroupProps`](ReactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`, `TSubmitReturn`\>

## Returns

`ReactNode`
