---
id: SolidFormGroupProps
title: SolidFormGroupProps
---

# Interface: SolidFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:328](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L328)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### children

```ts
children: (groupApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:345](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L345)

#### Parameters

##### groupApi

[`SolidFormGroupAccessor`](../type-aliases/SolidFormGroupAccessor.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`Element`
