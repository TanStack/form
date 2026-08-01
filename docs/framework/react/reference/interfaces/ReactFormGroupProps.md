---
id: ReactFormGroupProps
title: ReactFormGroupProps
---

# Interface: ReactFormGroupProps\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:564](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L564)

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

### children()

```ts
children: (groupApi) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:581](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L581)

#### Parameters

##### groupApi

[`ReactFormGroupApi`](ReactFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`TGroupValidators`\>, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
