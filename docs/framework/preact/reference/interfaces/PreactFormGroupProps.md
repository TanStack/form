---
id: PreactFormGroupProps
title: PreactFormGroupProps
---

# Interface: PreactFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:310](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L310)

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

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### children

```ts
children: (groupApi) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:327](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L327)

#### Parameters

##### groupApi

[`PreactFormGroupApi`](PreactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`ComponentChildren`
