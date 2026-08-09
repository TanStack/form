---
id: SolidFormGroupComponent
title: SolidFormGroupComponent
---

# Interface: SolidFormGroupComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:357](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L357)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:362](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L362)

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
