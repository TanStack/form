---
id: SolidFormGroupComponent
title: SolidFormGroupComponent
---

Defined in: [packages/solid-form/src/Components.public.ts:353](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L353)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:358](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L358)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

## Parameters

### props

[`SolidFormGroupProps`](SolidFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`Element`
