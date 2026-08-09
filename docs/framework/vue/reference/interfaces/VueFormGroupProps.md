---
id: VueFormGroupProps
title: VueFormGroupProps
---

# Interface: VueFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:374](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L374)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Properties

### \[fieldComponentsType\]?

```ts
readonly optional [fieldComponentsType]?: TFieldComponents;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:391](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L391)
