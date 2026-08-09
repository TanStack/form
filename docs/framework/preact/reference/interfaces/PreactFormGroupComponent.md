---
id: PreactFormGroupComponent
title: PreactFormGroupComponent
---

# Interface: PreactFormGroupComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:339](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L339)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
PreactFormGroupComponent<TGroupName, TGroupValue, TGroupValidators>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:344](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L344)

## Type Parameters

### TGroupName

`TGroupName` *extends* `string`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

## Parameters

### props

[`PreactFormGroupProps`](PreactFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ComponentChildren`
