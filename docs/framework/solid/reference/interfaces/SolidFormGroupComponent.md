---
id: SolidFormGroupComponent
title: SolidFormGroupComponent
---

Defined in: [packages/solid-form/src/Components.public.ts:355](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L355)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormGroupComponent<TGroupName, TGroupValue, TGroupValidators, TSubmitReturn>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:360](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L360)

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

[`SolidFormGroupProps`](SolidFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`, `TSubmitReturn`\>

## Returns

`Element`
